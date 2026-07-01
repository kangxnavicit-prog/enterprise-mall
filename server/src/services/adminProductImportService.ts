// Enterprise Mall - Admin Product Import Service
// Handles batch product import from Excel (.xlsx) files
// Auto-creates missing categories by name, validates SKU uniqueness

import * as XLSX from 'xlsx';
import { prisma, parseJsonArray, stringifyJsonArray } from '../config/database';
import { ImportProductRow, ImportProductResult, ImportFailure } from '../types';
import { createBadRequestError, createConflictError } from '../utils/errors';

/** Excel column header mapping to product fields */
const COLUMN_MAP: Record<string, string> = {
  '商品名称': 'name',
  'SKU': 'sku',
  '价格': 'pointsPrice',
  '库存': 'stock',
  '品类': 'categoryName',
  '图片链接': 'imageUrl',
};

/**
 * Import products from an uploaded xlsx file.
 * @param fileBuffer - The raw buffer of the uploaded xlsx file
 * @returns Import result with success/failure statistics
 */
export async function importProducts(fileBuffer: Buffer): Promise<ImportProductResult> {
  // Parse Excel workbook from buffer
  const workbook: XLSX.WorkBook = XLSX.read(fileBuffer, { type: 'buffer' });

  // Use the first sheet
  const sheetName: string = workbook.SheetNames[0];
  const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw createBadRequestError('Excel file contains no worksheet');
  }

  // Convert sheet to array of row objects using header row
  const rawData: unknown[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  if (rawData.length === 0) {
    throw createBadRequestError('Excel file contains no data rows');
  }

  // Map raw rows to structured ImportProductRow objects
  const rows: ImportProductRow[] = rawData.map((row: unknown, index: number) => {
    const record = row as Record<string, unknown>;
    return {
      rowIndex: index + 2, // Excel row number (1-based, +1 for header row)
      name: String(record['商品名称'] ?? '').trim(),
      sku: String(record['SKU'] ?? '').trim(),
      pointsPrice: Number(record['价格'] ?? 0),
      stock: Number(record['库存'] ?? 0),
      categoryName: String(record['品类'] ?? '').trim(),
      imageUrl: String(record['图片链接'] ?? '').trim(),
    };
  });

  // Track results
  const successes: number = 0;
  const failures: ImportFailure[] = [];
  const createdCategoryNames: string[] = [];

  // Collect unique category names from the Excel data
  const categoryNames: string[] = rows
    .map((row: ImportProductRow) => row.categoryName)
    .filter((name: string) => name.length > 0);

  const uniqueCategoryNames: string[] = [...new Set(categoryNames)];

  // Auto-create missing categories
  const categoryMap: Map<string, number> = new Map();

  for (const catName of uniqueCategoryNames) {
    const existingCategory = await prisma.category.findUnique({
      where: { name: catName },
    });

    if (existingCategory) {
      categoryMap.set(catName, existingCategory.id);
    } else {
      const newCategory = await prisma.category.create({
        data: {
          name: catName,
          icon: null,
          sortOrder: 0,
          isActive: true,
        },
      });
      categoryMap.set(catName, newCategory.id);
      createdCategoryNames.push(catName);
    }
  }

  // Check existing SKUs in the database for uniqueness validation
  const existingSkus: Set<string> = new Set();
  const allProducts = await prisma.product.findMany({ select: { sku: true } });
  for (const p of allProducts) {
    existingSkus.add(p.sku);
  }

  // Track SKUs seen in this import batch for intra-batch duplicate detection
  const seenSkus: Set<string> = new Set();

  // Process each row
  let successCount: number = 0;

  for (const row of rows) {
    // Validate required fields
    if (!row.name) {
      failures.push({ row: row.rowIndex, name: row.name || '(empty)', reason: '商品名称不能为空' });
      continue;
    }

    if (!row.sku) {
      failures.push({ row: row.rowIndex, name: row.name, reason: 'SKU不能为空' });
      continue;
    }

    if (row.pointsPrice <= 0) {
      failures.push({ row: row.rowIndex, name: row.name, reason: '价格必须为正整数' });
      continue;
    }

    if (row.stock < 0) {
      failures.push({ row: row.rowIndex, name: row.name, reason: '库存不能为负数' });
      continue;
    }

    if (!row.categoryName) {
      failures.push({ row: row.rowIndex, name: row.name, reason: '品类不能为空' });
      continue;
    }

    // Check SKU uniqueness — first against database, then against batch
    if (existingSkus.has(row.sku)) {
      failures.push({ row: row.rowIndex, name: row.name, reason: `SKU "${row.sku}" 已存在于数据库中` });
      continue;
    }

    if (seenSkus.has(row.sku)) {
      failures.push({ row: row.rowIndex, name: row.name, reason: `SKU "${row.sku}" 在本次导入中重复` });
      continue;
    }

    seenSkus.add(row.sku);

    // Get categoryId from the map
    const categoryId: number | undefined = categoryMap.get(row.categoryName);
    if (!categoryId) {
      failures.push({ row: row.rowIndex, name: row.name, reason: `品类 "${row.categoryName}" 未找到或创建失败` });
      continue;
    }

    // Build images array from imageUrl
    const images: string = row.imageUrl
      ? stringifyJsonArray([row.imageUrl])
      : stringifyJsonArray([]);

    try {
      await prisma.product.create({
        data: {
          categoryId,
          name: row.name,
          sku: row.sku,
          description: null,
          images,
          pointsPrice: Math.round(row.pointsPrice),
          stock: Math.round(row.stock),
          status: 'ACTIVE',
        },
      });

      successCount++;
      // Add the SKU to existing set to prevent intra-batch duplicates being caught later
      existingSkus.add(row.sku);
    } catch (error: any) {
      failures.push({ row: row.rowIndex, name: row.name, reason: `创建失败: ${error?.message || '未知错误'}` });
    }
  }

  return {
    successCount,
    failCount: failures.length,
    failures,
    createdCategories: createdCategoryNames,
  };
}

export const adminProductImportService = { importProducts };
