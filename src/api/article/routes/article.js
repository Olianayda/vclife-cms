'use strict';

/**
 * article router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::article.article', {
  config: {
    create: {
      policies: ['api::article.only-community-for-user'],
    },
  },
});
