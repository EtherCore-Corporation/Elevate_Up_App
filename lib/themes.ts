import {
  Diamond,
  Gem,
  Flower2,
  Flame,
  Sun,
  Heart,
  Moon,
  Star
} from 'lucide-react'

export const projectThemes = [
  {
    id: 'sapphire',
    name: 'Sapphire Blue',
    icon: Diamond,
    colors: {
      primary: '#0F52BA',
      secondary: '#1E90FF',
    },
    description: 'A deep, rich blue for a calming and trustworthy feel'
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    icon: Gem,
    colors: {
      primary: '#50C878',
      secondary: '#3CB371',
    },
    description: 'A vibrant green that symbolizes growth and renewal'
  },
  {
    id: 'amethyst',
    name: 'Amethyst Purple',
    icon: Flower2,
    colors: {
      primary: '#9966CC',
      secondary: '#B784E0',
    },
    description: 'A soft, regal purple for creativity and luxury'
  },
  {
    id: 'ruby',
    name: 'Ruby Red',
    icon: Flame,
    colors: {
      primary: '#E0115F',
      gradient: 'from-[#E0115F] to-[#FF4081]',
      text: 'text-red-100',
      border: 'border-red-400',
      hover: 'hover:bg-red-600/20'
    },
    description: 'A bold, passionate red for attention-grabbing accents'
  },
  {
    id: 'citrine',
    name: 'Citrine Yellow',
    icon: Sun,
    colors: {
      primary: '#E4D00A',
      secondary: '#FFD700',
    },
    description: 'A warm, golden yellow for energy and positivity'
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz Pink',
    icon: Heart,
    colors: {
      primary: '#F7CAC9',
      secondary: '#FFB6C1',
    },
    description: 'A soft, soothing pink for a gentle and inviting touch'
  },
  {
    id: 'onyx',
    name: 'Onyx Black',
    icon: Moon,
    colors: {
      primary: '#0A0A0A',
      gradient: 'from-[#0A0A0A] to-[#2C2C2C]',
      text: 'text-gray-100',
      border: 'border-gray-400',
      hover: 'hover:bg-gray-600/20'
    },
    description: 'A deep black for contrast and modern elegance'
  },
  {
    id: 'pearl',
    name: 'Pearl White',
    icon: Star,
    colors: {
      primary: '#F5F5F5',
      secondary: '#FFFFFF',
    },
    description: 'A clean, soft white for background and balance'
  }
] 