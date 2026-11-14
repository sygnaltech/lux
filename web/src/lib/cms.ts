/**
 * Build-time reads from Sanity, for the CMS routes.
 *
 * Every query runs during `astro build` against published content, so the
 * output is static HTML with no runtime dependency on Sanity at all.
 *
 * `fetchImage` resolves an image to a URL via @sanity/image-url. Bind it with
 * `bindImage`, which strips `srcset`/`sizes` — Webflow's responsive
 * derivatives do not exist for a Sanity asset, and a stale `srcset` beats the
 * `src` beside it.
 */
import {client, urlFor} from './sanity';

export interface SanityImage {
  _type: 'image';
  asset?: {_ref: string; _type: 'reference'};
  alt?: string;
}

export interface SanitySlug {
  current: string;
}

export interface ReviewDoc {
  _id: string;
  title: string;
  slug: SanitySlug;
  from?: string;
  where?: string;
  rating: number;
  brief: string;
  text?: unknown[];
  link?: string;
  date: string;
}

export interface ServiceDoc {
  _id: string;
  title: string;
  slug: SanitySlug;
  shortName: string;
  order?: number;
  shortDescription?: string;
  description?: unknown[];
  notice?: unknown[];
  icon?: SanityImage;
  pageImage?: SanityImage;
  currentlyUnavailable?: boolean;
  category?: {title: string; slug: SanitySlug};
}

export interface TeamDoc {
  _id: string;
  title: string;
  slug: SanitySlug;
  jobTitle?: string;
  order?: number;
  bio?: unknown[];
  profilePicture?: SanityImage;
  profileSquare?: SanityImage;
  linkedinUrl?: string;
}

export interface PostDoc {
  _id: string;
  title: string;
  slug: SanitySlug;
  date: string;
  summary?: string;
  mainImage?: SanityImage;
  body?: unknown[];
}

export interface CategoryDoc {
  _id: string;
  title: string;
  slug: SanitySlug;
  shortDescription?: string;
  brief?: unknown[];
  notes?: unknown[];
  bookingNote?: unknown[];
  bookingButtonText: string;
  image?: SanityImage;
  icon?: SanityImage;
}

/** A resolvable URL for a Sanity image, or undefined when there is no asset. */
export const imageUrl = (image: SanityImage | undefined, width = 1200): string | undefined =>
  image?.asset ? urlFor(image as never).width(width).auto('format').url() : undefined;

const DOC_FIELDS = '_id, title, slug, legacy';

export const allReviews = () =>
  client.fetch<ReviewDoc[]>(
    `*[_type == "review"] | order(date desc) {
      ${DOC_FIELDS}, from, where, rating, brief, text, link, date
    }`,
  );

/**
 * Reviews for the LISTING page: rating 4 and above only.
 *
 * Read off the live site, not invented: of the 17 published reviews rated
 * below 4, not one appears in Webflow's rendered listing, while all 152 rated
 * 4+ are eligible. They keep their own pages — and their live URLs — which is
 * why `allReviews` is unfiltered and this is separate.
 */
export const listedReviews = () =>
  client.fetch<ReviewDoc[]>(
    `*[_type == "review" && rating >= 4] | order(date desc) {
      ${DOC_FIELDS}, from, rating, brief, date
    }`,
  );

export const allServices = () =>
  client.fetch<ServiceDoc[]>(
    `*[_type == "service"] | order(coalesce(order, 9999) asc) {
      ${DOC_FIELDS}, shortName, order, shortDescription, description, notice,
      icon, pageImage, currentlyUnavailable,
      "category": category->{title, slug}
    }`,
  );

export const allTeam = () =>
  client.fetch<TeamDoc[]>(
    `*[_type == "team"] | order(coalesce(order, 9999) asc) {
      ${DOC_FIELDS}, jobTitle, order, bio, profilePicture, profileSquare, linkedinUrl
    }`,
  );

export const allPosts = () =>
  client.fetch<PostDoc[]>(
    `*[_type == "post"] | order(date desc) {
      ${DOC_FIELDS}, date, summary, mainImage, body
    }`,
  );

export const allCategories = () =>
  client.fetch<CategoryDoc[]>(
    `*[_type == "category"] | order(title asc) {
      ${DOC_FIELDS}, shortDescription, brief, notes, bookingNote, bookingButtonText, image, icon
    }`,
  );

/** The document a template was extracted from, by slug. Throws if absent. */
export function sampleOf<T extends {slug: SanitySlug}>(docs: T[], slug: string, type: string): T {
  const doc = docs.find((d) => d.slug.current === slug);
  if (!doc) {
    throw new Error(
      `cms: no ${type} with slug "${slug}" — TEMPLATE_SAMPLE in src/lib/templates.ts ` +
        `names it as the template's sample item, but the dataset does not contain it.`,
    );
  }
  return doc;
}
