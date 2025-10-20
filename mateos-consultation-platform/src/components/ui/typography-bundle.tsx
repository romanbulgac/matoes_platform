// Typography bundle for easier imports
import {
    TypographyBlockquote,
    TypographyH1,
    TypographyH2,
    TypographyH3,
    TypographyH4,
    TypographyH5,
    TypographyH6,
    TypographyInlineCode,
    TypographyLarge,
    TypographyLead,
    TypographyList,
    TypographyMuted,
    TypographyOrderedList,
    TypographyP,
    TypographySection,
    TypographySmall,
    TypographyTable,
} from './typography';

// Export all typography components as a bundle for easy import
// Usage: import { Typography } from '@/components/ui/typography-bundle'
//        <Typography.H1>Title</Typography.H1>
export const Typography = {
  H1: TypographyH1,
  H2: TypographyH2,
  H3: TypographyH3,
  H4: TypographyH4,
  H5: TypographyH5,
  H6: TypographyH6,
  P: TypographyP,
  Lead: TypographyLead,
  Large: TypographyLarge,
  Small: TypographySmall,
  Muted: TypographyMuted,
  Blockquote: TypographyBlockquote,
  List: TypographyList,
  OrderedList: TypographyOrderedList,
  InlineCode: TypographyInlineCode,
  Table: TypographyTable,
  Section: TypographySection,
};