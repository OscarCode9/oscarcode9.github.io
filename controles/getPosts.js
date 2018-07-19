async function getPosts() {
  const post = require('../post/postsInfo.json').posts;
  return post;
}

module.exports = getPosts;