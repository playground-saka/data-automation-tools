import React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {}

function FormPelanggan({}: Props) {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col'>
        <h1 className='text-base text-stone-800'>Pelanggan Baru</h1>
        <p className='text-sm text-stone-800/70'>Isi detail di bawah ini di setiap langkah nya.</p>
      </div>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="id" className="text-right text-xs">ID Pelanggan</Label>
          <Input id="id" type='tel' className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nama" className="text-right text-xs">Nama Pelanggan</Label>
          <Input id="nama" type='text' className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right text-xs">Kategori Pelanggan</Label>
          <Select>
            <SelectTrigger className="col-span-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="PLTM">PLTM</SelectItem>
                <SelectItem value="PLTMH">PLTMH</SelectItem>
                <SelectItem value="PLTMS">PLTMS</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='flex flex-row gap-2 justify-end'>
        <Button type="submit" className='bg-gradient-to-r from-blue-700 to-fuchsia-500'>Submit</Button>
      </div>
    </div>
  )
}

export default FormPelanggan