// Enterprise Mall - Product Import Dialog
// Dialog for uploading xlsx file to batch import products
// Shows upload area, import progress, and results after completion

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

import { useAdminStore } from '../stores/adminStore';
import { useNotification } from '../hooks/useNotification';
import { ImportResult } from '../types/product';

interface ProductImportDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Step states for the import dialog flow */
type ImportStep = 'upload' | 'importing' | 'result';

const ProductImportDialog: React.FC<ProductImportDialogProps> = ({ open, onClose, onSuccess }) => {
  const adminStore = useAdminStore();
  const { notifySuccess, notifyError } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<ImportStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  /** Handle file selection from input or drag */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file: File | undefined = event.target.files?.[0];
    if (!file) return;

    // Validate file extension
    const ext: string = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (ext !== 'xlsx' && ext !== 'xls') {
      notifyError('请选择 .xlsx 或 .xls 格式的 Excel 文件');
      return;
    }

    setSelectedFile(file);
  };

  /** Handle drag-and-drop file */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    const file: File | undefined = event.dataTransfer.files[0];
    if (!file) return;

    const ext: string = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (ext !== 'xlsx' && ext !== 'xls') {
      notifyError('请选择 .xlsx 或 .xls 格式的 Excel 文件');
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  /** Execute the import by uploading to backend */
  const handleImport = async (): Promise<void> => {
    if (!selectedFile) return;

    setStep('importing');
    try {
      const result: ImportResult = await adminStore.importProducts(selectedFile);
      setImportResult(result);
      setStep('result');

      if (result.successCount > 0) {
        notifySuccess(`成功导入 ${result.successCount} 个商品`);
        onSuccess();
      }
    } catch (error: any) {
      notifyError(error?.message || '导入失败');
      setStep('upload');
    }
  };

  /** Reset dialog state and close */
  const handleClose = (): void => {
    setStep('upload');
    setSelectedFile(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  /** Remove selected file and go back to upload step */
  const handleRemoveFile = (): void => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onClose={step === 'importing' ? undefined : handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          批量导入商品
        </Typography>
        {step !== 'importing' && (
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent>
        {/* Step 1: Upload */}
        {step === 'upload' && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              请上传包含商品数据的 Excel 文件（.xlsx 格式）。
              Excel 列格式：商品名称、SKU、价格、库存、品类、图片链接
            </Typography>

            {!selectedFile ? (
              <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                sx={{
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    bgcolor: 'primary.50',
                  },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="body1" color="primary.main">
                  点击或拖拽 Excel 文件到此处上传
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  支持 .xlsx / .xls 格式
                </Typography>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  hidden
                  onChange={handleFileSelect}
                />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <CloudUploadIcon color="primary" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight="bold">{selectedFile.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`${(selectedFile.size / 1024).toFixed(1)} KB`}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={handleRemoveFile}>
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        )}

        {/* Step 2: Importing */}
        {step === 'importing' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="body1">正在导入商品数据...</Typography>
            <Typography variant="body2" color="text.secondary">请稍候，不要关闭此窗口</Typography>
          </Box>
        )}

        {/* Step 3: Result */}
        {step === 'result' && importResult && (
          <Box>
            {/* Summary alert */}
            {importResult.failCount === 0 ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                <AlertTitle>导入完成</AlertTitle>
                成功导入 {importResult.successCount} 个商品
                {importResult.createdCategories.length > 0 && (
                  <>，自动创建了 {importResult.createdCategories.length} 个新品类</>
                )}
              </Alert>
            ) : (
              <Alert severity={importResult.successCount > 0 ? 'warning' : 'error'} sx={{ mb: 2 }}>
                <AlertTitle>导入完成（部分失败）</AlertTitle>
                成功 {importResult.successCount} 个，失败 {importResult.failCount} 个
              </Alert>
            )}

            {/* Created categories */}
            {importResult.createdCategories.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  新创建的品类：
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {importResult.createdCategories.map((catName: string) => (
                    <Chip key={catName} label={catName} color="primary" variant="outlined" size="small" />
                  ))}
                </Box>
              </Box>
            )}

            {/* Failures detail table */}
            {importResult.failures.length > 0 && (
              <Box>
                <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                  失败详情：
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>行号</TableCell>
                        <TableCell>商品名称</TableCell>
                        <TableCell>失败原因</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {importResult.failures.map((failure, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{failure.row}</TableCell>
                          <TableCell>{failure.name}</TableCell>
                          <TableCell><Typography color="error">{failure.reason}</Typography></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {step === 'upload' && selectedFile && (
          <Button variant="contained" onClick={handleImport} disabled={adminStore.importLoading}>
            确认导入
          </Button>
        )}
        {step === 'result' && (
          <Button variant="contained" onClick={handleClose}>
            完成
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProductImportDialog;
