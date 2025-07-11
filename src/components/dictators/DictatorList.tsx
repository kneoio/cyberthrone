import React, { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Stack,
  InputAdornment
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import { Dictator } from '../../types/dictator';
import { searchDictators, filterDictatorsByCountry, getUniqueCountries } from '../../utils/helpers';
import DictatorCard from './DictatorCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface DictatorListProps {
  dictators: Dictator[];
  loading?: boolean;
}

const DictatorList: React.FC<DictatorListProps> = ({ dictators, loading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const countries = useMemo(() => getUniqueCountries(dictators), [dictators]);

  const filteredDictators = useMemo(() => {
    let filtered = dictators;
    
    if (searchQuery) {
      filtered = searchDictators(filtered, searchQuery);
    }
    
    if (selectedCountry) {
      filtered = filterDictatorsByCountry(filtered, selectedCountry);
    }
    
    return filtered;
  }, [dictators, searchQuery, selectedCountry]);

  const countryOptions = useMemo(() => [
    { label: 'All Countries', value: '' },
    ...countries.map(country => ({ label: country, value: country }))
  ], [countries]);

  if (loading) {
    return <LoadingSpinner message="Loading dictators..." />;
  }

  return (
    <Stack spacing={3}>
      {/* Search and Filter Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search dictators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
          />
          
          <FormControl sx={{ width: 200 }} size="small">
            <InputLabel>Filter by country</InputLabel>
            <Select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              label="Filter by country"
              startAdornment={
                <InputAdornment position="start">
                  <FilterList />
                </InputAdornment>
              }
            >
              {countryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        
        <Typography variant="body2" color="text.secondary">
          {filteredDictators.length} dictator{filteredDictators.length !== 1 ? 's' : ''} found
        </Typography>
      </Box>

      {/* Dictators Grid */}
      {filteredDictators.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No dictators found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredDictators.map((dictator) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={dictator.id}>
              <DictatorCard dictator={dictator} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
};

export default DictatorList;
