// Enterprise Mall - SearchBar Component
// Search input with submit button for product search

import React, { useState } from 'react';
import { TextField, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchBarProps {
  initialValue?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  onSearch,
  placeholder = '搜索商品...',
}) => {
  const [value, setValue] = useState<string>(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        size="small"
        sx={{ flex: 1 }}
        InputProps={{
          endAdornment: value && (
            <IconButton size="small" onClick={handleClear}>
              <ClearIcon />
            </IconButton>
          ),
        }}
      />
      <IconButton color="primary" type="submit">
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
