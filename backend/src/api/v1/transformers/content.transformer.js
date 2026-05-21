export class ContentTransformer {
  static toResponse(content) {
    if (!content) return null;
    return {
      id: content._id?.toString(),
      page: content.page,
      data: {
        navigation: content.navigation,
        hero: content.hero,
        about: content.about,
        areas: content.areas,
        partners: content.partners,
        research: content.research,
        advisory: content.advisory,
        pricing: content.pricing,
        testimonials: content.testimonials,
        contact: content.contact,
        cta: content.cta,
        footer: content.footer,
        privacyPolicy: content.privacyPolicy,
        termsOfUse: content.termsOfUse,
        accessibility: content.accessibility,
        metadata: content.metadata,
      },
      published: content.published,
      version: content.version,
      updatedBy: content.updatedBy,
      updatedAt: content.updatedAt?.toISOString(),
      createdAt: content.createdAt?.toISOString(),
      _links: {
        self: `/api/v1/content/${content.page}`,
        update: { href: `/api/v1/content`, method: 'PUT' },
      },
    };
  }
}