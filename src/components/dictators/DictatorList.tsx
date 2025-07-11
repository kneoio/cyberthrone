import React, { useState, useMemo } from 'react';
import { NGrid, NGridItem, NSpace, NInput, NSelect, NEmpty, NText } from '@naive-ui/react';
import { Search, Filter } from '@vicons/ionicons5';
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
    <NSpace vertical size="large">
      {/* Search and Filter Controls */}
      <NSpace align="center" justify="space-between">
        <NSpace align="center">
          <NInput
            placeholder="Search dictators..."
            value={searchQuery}
            onInput={setSearchQuery}
            style={{ width: '300px' }}
            prefix={() => <Search />}
            clearable
          />
          
          <NSelect
            placeholder="Filter by country"
            value={selectedCountry}
            onUpdateValue={setSelectedCountry}
            options={countryOptions}
            style={{ width: '200px' }}
            renderTag={() => <Filter />}
            clearable
          />
        </NSpace>
        
        <NText depth="2">
          {filteredDictators.length} dictator{filteredDictators.length !== 1 ? 's' : ''} found
        </NText>
      </NSpace>

      {/* Dictators Grid */}
      {filteredDictators.length === 0 ? (
        <NEmpty description="No dictators found" />
      ) : (
        <NGrid
          xGap="16"
          yGap="16"
          cols="1 s:2 m:3 l:4"
          responsive="screen"
        >
          {filteredDictators.map((dictator) => (
            <NGridItem key={dictator.id}>
              <DictatorCard dictator={dictator} />
            </NGridItem>
          ))}
        </NGrid>
      )}
    </NSpace>
  );
};

export default DictatorList;
