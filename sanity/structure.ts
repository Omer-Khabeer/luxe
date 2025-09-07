// sanity/structure.ts

// Minimal type for Structure Builder list items we care about
type SBListItem = {
  getId?: () => string | undefined;
};

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S: any, _context: any) =>
  S.list()
    .title("Luxe Ecommerce")
    .items([
      S.documentTypeListItem("category").title("Categories"),
      S.divider(),
      ...S.documentTypeListItems().filter((item: SBListItem) => {
        const id = item.getId?.();
        return !!id && !["post", "category"].includes(id);
      }),
    ]);

export default structure;
