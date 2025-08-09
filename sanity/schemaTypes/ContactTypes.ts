import {defineField, defineType} from 'sanity'

export const contactTypes = defineType({
  name: 'contactData',
  title: 'Contact Data',
  type: 'document',
  fields: [
    defineField({
      name: 'MyPhoto',
      title: 'My Photo',
      type: 'image',
    }),
    defineField({
      name: 'Email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'Socials',
      title: 'Socials',
      type: 'array',
      of: [{type: 'url'}],
    }),
  ],
})
