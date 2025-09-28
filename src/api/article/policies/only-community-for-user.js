'use strict';

module.exports = async (ctx, next) => {
  const user = ctx.state.user;
  if (!user) return ctx.unauthorized();

  // allow authors to publish anywhere
  const isAuthor = user.role && user.role.name === 'author';
  if (isAuthor) return next();

  const categoryId = ctx.request.body?.data?.category;
  if (!categoryId) return ctx.badRequest('Category required');

  const category = await strapi.entityService.findOne('api::category.category', categoryId, {
    fields: ['id', 'slug'],
  });
  if (!category || category.slug !== 'community') {
    return ctx.forbidden('You can create articles only in "community" category');
  }

  await next();
};


