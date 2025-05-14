
import { useState } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInput
} from '@/components/ui/sidebar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

export interface FilterOptions {
  category: string;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  conditions: string[];
}

interface SidebarFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const categories = [
  'All Items',
  'Dresses',
  'Tops',
  'Bottoms',
  'Outerwear',
  'Accessories',
  'Footwear'
];

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const conditionOptions = ['New', 'Like New', 'Good', 'Fair'];

export function SidebarFilters({ onFilterChange }: SidebarFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size]);
    } else {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    }
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setSelectedConditions([...selectedConditions, condition]);
    } else {
      setSelectedConditions(selectedConditions.filter(c => c !== condition));
    }
  };

  const applyFilters = () => {
    onFilterChange({
      category: selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sizes: selectedSizes,
      conditions: selectedConditions
    });
  };

  const resetFilters = () => {
    setSelectedCategory('All Items');
    setPriceRange([0, 5000]);
    setSelectedSizes([]);
    setSelectedConditions([]);
    
    onFilterChange({
      category: 'All Items',
      minPrice: 0,
      maxPrice: 5000,
      sizes: [],
      conditions: []
    });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarMenu>
            {categories.map((category) => (
              <SidebarMenuItem key={category}>
                <SidebarMenuButton 
                  isActive={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Price Range */}
        <SidebarGroup>
          <SidebarGroupLabel>Price Range</SidebarGroupLabel>
          <div className="px-3 py-2">
            <Slider
              value={priceRange}
              min={0}
              max={5000}
              step={100}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="my-6"
            />
            <div className="flex items-center justify-between mt-2">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </SidebarGroup>

        {/* Sizes */}
        <SidebarGroup>
          <SidebarGroupLabel>Sizes</SidebarGroupLabel>
          <div className="px-3 py-2 grid grid-cols-3 gap-2">
            {sizeOptions.map((size) => (
              <div className="flex items-center space-x-2" key={size}>
                <Checkbox 
                  id={`size-${size}`} 
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={(checked) => handleSizeChange(size, checked === true)}
                />
                <Label htmlFor={`size-${size}`}>{size}</Label>
              </div>
            ))}
          </div>
        </SidebarGroup>

        {/* Conditions */}
        <SidebarGroup>
          <SidebarGroupLabel>Condition</SidebarGroupLabel>
          <div className="px-3 py-2 space-y-2">
            {conditionOptions.map((condition) => (
              <div className="flex items-center space-x-2" key={condition}>
                <Checkbox 
                  id={`condition-${condition}`} 
                  checked={selectedConditions.includes(condition)}
                  onCheckedChange={(checked) => handleConditionChange(condition, checked === true)}
                />
                <Label htmlFor={`condition-${condition}`}>{condition}</Label>
              </div>
            ))}
          </div>
        </SidebarGroup>

        {/* Apply Filters Button */}
        <div className="px-3 py-4">
          <Button 
            className="w-full"
            onClick={applyFilters}
          >
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
