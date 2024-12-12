"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from 'next/image'

export type Carrier = 'MTN' | 'ORANGE'

interface CarrierSelectorProps {
  value: Carrier
  onChange: (value: Carrier) => void
}

export function CarrierSelector({ value, onChange }: CarrierSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(value) => onChange(value as Carrier)}
      className="grid grid-cols-2 gap-4"
    >
      <div>
        <RadioGroupItem
          value="MTN"
          id="mtn"
          className="peer sr-only"
        />
        <Label
          htmlFor="mtn"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
        >
          <Image
            src="/carriers/mtn.png"
            alt="MTN Money"
            width={60}
            height={60}
            className="mb-2"
          />
          <span className="text-sm font-medium">MTN Mobile Money</span>
        </Label>
      </div>

      <div>
        <RadioGroupItem
          value="ORANGE"
          id="orange"
          className="peer sr-only"
        />
        <Label
          htmlFor="orange"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
        >
          <Image
            src="/carriers/orange.png"
            alt="Orange Money"
            width={60}
            height={60}
            className="mb-2"
          />
          <span className="text-sm font-medium">Orange Money</span>
        </Label>
      </div>
    </RadioGroup>
  )
} 