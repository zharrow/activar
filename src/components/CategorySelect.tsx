'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CategorySelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export default function CategorySelect({ value, onValueChange, placeholder = 'Toutes les catégories' }: CategorySelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full md:w-[250px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Toutes les catégories</SelectItem>

        <SelectGroup>
          <SelectLabel>Sport</SelectLabel>
          <SelectItem value="sport">Tous les sports</SelectItem>
          <SelectItem value="sport-football">⚽ Football</SelectItem>
          <SelectItem value="sport-basketball">🏀 Basketball</SelectItem>
          <SelectItem value="sport-tennis">🎾 Tennis</SelectItem>
          <SelectItem value="sport-rugby">🏉 Rugby</SelectItem>
          <SelectItem value="sport-natation">🏊 Natation</SelectItem>
          <SelectItem value="sport-arts_martiaux">🥋 Arts martiaux</SelectItem>
          <SelectItem value="sport-yoga">🧘 Yoga</SelectItem>
          <SelectItem value="sport-danse">💃 Danse</SelectItem>
          <SelectItem value="sport-escalade">🧗 Escalade</SelectItem>
          <SelectItem value="sport-fitness">💪 Fitness</SelectItem>
          <SelectItem value="sport-musculation">🏋️ Musculation</SelectItem>
          <SelectItem value="sport-athletisme">🏃 Athlétisme</SelectItem>
          <SelectItem value="sport-cyclisme">🚴 Cyclisme</SelectItem>
          <SelectItem value="sport-volleyball">🏐 Volleyball</SelectItem>
          <SelectItem value="sport-handball">🤾 Handball</SelectItem>
          <SelectItem value="sport-badminton">🏸 Badminton</SelectItem>
        </SelectGroup>

        <SelectGroup>
          <SelectLabel>Intellectuel</SelectLabel>
          <SelectItem value="intellectual">Toutes les activités intellectuelles</SelectItem>
          <SelectItem value="intellectual-echecs">♟️ Échecs</SelectItem>
          <SelectItem value="intellectual-go">🀄 Go</SelectItem>
          <SelectItem value="intellectual-bridge">🃏 Bridge</SelectItem>
          <SelectItem value="intellectual-scrabble">🔤 Scrabble</SelectItem>
          <SelectItem value="intellectual-lecture">📚 Lecture</SelectItem>
          <SelectItem value="intellectual-debat">💭 Débat</SelectItem>
          <SelectItem value="intellectual-langues">🗣️ Langues</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
