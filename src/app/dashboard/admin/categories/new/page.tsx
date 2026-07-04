import CategoryDetails from '@/components/dashboard/forms/category-details'
import React from 'react'

export default function AdminNewCategoryPage() {
  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!CLOUDINARY_UPLOAD_PRESET) return null;

  return (
    <div className='w-full'>
        <CategoryDetails upload_preset={CLOUDINARY_UPLOAD_PRESET}/>
    </div>
  )
}
