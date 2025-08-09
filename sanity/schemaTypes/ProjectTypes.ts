import {defineField, defineType} from 'sanity'

export const projectTypes = defineType({
  name: 'projectTypes',
  title: 'Project Types',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'Image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'Link',
      title: 'Link',
      type: 'string',
    }),
    defineField({
      name: 'Description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'Rating',
      title: 'Rating',
      type: 'number',
    }),
  ],
})
