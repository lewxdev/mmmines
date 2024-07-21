/** @see {@link https://github.com/tailwindlabs/prettier-plugin-tailwindcss#sorting-classes-in-template-literals} */
export const tw = (
  strings: readonly string[] | ArrayLike<string>,
  ...values: any[]
) => String.raw({ raw: strings }, ...values);
