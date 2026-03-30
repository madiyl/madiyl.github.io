import { Calculator, Car, Flower2 } from 'lucide-react'

export const hubItemIcons = {
  Calculator,
  Car,
  Flower2,
} as const

export type HubItemIconKey = keyof typeof hubItemIcons

