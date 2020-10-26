const express = require('express');
const router = express.Router();

const middle = require('../middleware');
const AppCenterApi = require('../appcenter/api');

// GET /
router.get('/', function (req, res, next) {
  console.log(req.session);
  AppCenterApi.getApps()
    .then(apps => {
      const promises = [];
      apps.forEach(a => {
        const latestBuildPromise = AppCenterApi.getAppBuilds(a.owner.name, a.name)
          .then(builds => {
            const succeededBuilds = builds.filter(b => b.result === 'succeeded');
            return {
              ...a,
              latestSuccessfulBuild: succeededBuilds.length > 0 ? succeededBuilds[0] : null,
            };
          })
          .catch(e => {
            return {
              ...a,
              latestSuccessfulBuild: null,
            }
          });
        promises.push(latestBuildPromise);
      });

      return Promise.all(promises);
    })
    .then(results => {
      return res.render('index', { title: "AppCenter Builds", results });
    })
    .catch(error => {
      return next(error);
    });
});

// GET /:owner_type/:owner/apps/:app/build/branches/:branch/builds/:build_id?type=build
router.get('/:owner_type/:owner/apps/:app/build/branches/:branch/builds/:build_id', function (req, res, next) {
  const download_type = req.query.type || 'build';
  AppCenterApi.getDownloadInfoForBuild(req.params.owner, req.params.app, req.params.build_id, download_type)
    .then(downloadInfo => {
      return res.redirect(downloadInfo.uri);
    })
    .catch(error => {
      return next(error);
    });
});

// GET /:owner_type/:owner/apps/:app/build/branches/:branch
router.get('/:owner_type/:owner/apps/:app/build/branches/:branch', function (req, res, next) {
  const allTheBuilds = [];
  AppCenterApi.getAppBuilds(req.params.owner, req.params.app, req.params.branch)
    .then(builds => {
      return res.render('builds', {
        title: `${req.params.app} | Builds | ${req.params.branch}`,
        builds: builds.filter(tmp => tmp.result === 'succeeded'),
        params: req.params,
      });
    })
    .catch(error => {
      console.log(error);
      if (error.statusCode === 404) {
        return res.render('builds', {
          title: `${req.params.app} | Builds | ${req.params.branch}`,
          builds: [],
          params: req.params,
        });
      }
      return next(error);
    });
});

module.exports = router;
