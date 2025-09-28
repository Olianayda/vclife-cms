'use strict';

module.exports = (plugin) => {
  // add custom routes for updating/deleting own account
  plugin.routes['content-api'].routes.push(
    {
      method: 'PUT',
      path: '/users/me',
      handler: 'user.updateMe',
      config: { policies: ['admin::isAuthenticatedAdmin', 'plugin::users-permissions.isAuthenticated'] },
    },
    {
      method: 'DELETE',
      path: '/users/me',
      handler: 'user.deleteMe',
      config: { policies: ['admin::isAuthenticatedAdmin', 'plugin::users-permissions.isAuthenticated'] },
    }
  );

  // extend controllers
  const userController = plugin.controllers.user;
  userController.updateMe = async (ctx) => {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();
    const data = ctx.request.body;
    const updated = await strapi.query('plugin::users-permissions.user').update({ where: { id: userId }, data });
    ctx.body = updated;
  };
  userController.deleteMe = async (ctx) => {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();
    await strapi.query('plugin::users-permissions.user').delete({ where: { id: userId } });
    ctx.body = { ok: true };
  };

  return plugin;
};


