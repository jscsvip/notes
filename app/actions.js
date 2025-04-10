'use server'

import { redirect } from 'next/navigation'
import {addNote, updateNote, delNote} from '@/lib/redis';
import { revalidatePath } from 'next/cache';


export async function saveNote(prevState, formData) {
  const noteId = formData.get('noteId')

  const data = JSON.stringify({
    title: formData.get('title'),
    content: formData.get('body'),
    updateTime: new Date()
  })



  if (noteId) {
    updateNote(noteId, data)
    revalidatePath('/', 'layout')

  } else {
    const res = await addNote(data)
    revalidatePath('/', 'layout')

  }
  return { message: `Add Success!` }
}

export async function deleteNote(prevState, formData) {
  const noteId = formData.get('noteId')
  delNote(noteId)
  revalidatePath('/', 'layout')
  redirect('/')
}