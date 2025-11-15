'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { MapPin } from 'lucide-react'
import { cityOptions } from '@/data/cities'

interface CityInputProps {
  value: string
  onChange: (value: string) => void
  onCitySelect: (coordinates: { latitude: number; longitude: number }) => void
  placeholder?: string
  className?: string
}

export default function CityInput({
  value,
  onChange,
  onCitySelect,
  placeholder = 'Saisir une grande ville (Paris, Lyon, Toulouse...)',
  className = '',
}: CityInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredCities, setFilteredCities] = useState(cityOptions)

  useEffect(() => {
    if (value.length === 0) {
      setFilteredCities(cityOptions)
      return
    }

    const filtered = cityOptions.filter((city) =>
      city.name.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredCities(filtered)
  }, [value])

  const handleCityClick = (city: typeof cityOptions[0]) => {
    onChange(city.name)
    onCitySelect({ latitude: city.latitude, longitude: city.longitude })
    setShowSuggestions(false)
  }

  const handleFocus = () => {
    setShowSuggestions(true)
  }

  const handleBlur = () => {
    // Delay to allow click event on suggestions
    setTimeout(() => setShowSuggestions(false), 200)
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="pl-10"
          autoComplete="off"
        />
      </div>

      {/* Autocomplete Suggestions */}
      {showSuggestions && (
        <div className="absolute z-[100] w-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {filteredCities.length > 0 ? (
            <div className="py-1">
              {/* Header */}
              <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-600">Top 20 grandes villes</span>
                <span className="text-xs text-neutral-500">{filteredCities.length} résultat{filteredCities.length > 1 ? 's' : ''}</span>
              </div>

              {/* Cities List */}
              {filteredCities.map((city) => (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => handleCityClick(city)}
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                  className="w-full px-4 py-2.5 text-left hover:bg-primary-50 transition-colors flex items-center gap-2 text-sm last:rounded-b-lg"
                >
                  <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  <span className="text-neutral-900 font-medium">{city.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-neutral-600 mb-1">Aucune ville trouvée</p>
              <p className="text-xs text-neutral-500">Seules les 20 plus grandes villes de France sont disponibles</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
