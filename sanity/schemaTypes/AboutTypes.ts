import {defineField, defineType} from 'sanity'

export const aboutTypes = defineType({
  name: 'aboutData',
  title: 'About Me Data',
  type: 'document',
  fields: [
    defineField({
      name: 'MyPhoto',
      title: 'My Photo',
      type: 'image',
    }),
    defineField({
      name: 'Heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'Content',
      title: 'Content',
      type: 'text',
    }),
  ],
})
