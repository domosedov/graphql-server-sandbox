const { GraphQLScalarType } = require('graphql');

let _id = 0;

const tags = [
  { photoID: '1', userID: 'gPlake' },
  { photoID: '2', userID: 'sSchmidt' },
  { photoID: '2', userID: 'mHattrup' },
  { photoID: '2', userID: 'gPlake' },
];

const users = [
  { githubLogin: 'mHattrup', name: 'Mike Hattrup' },
  { githubLogin: 'gPlake', name: 'Glen Plake' },
  { githubLogin: 'sSchmidt', name: 'Scot Schmidt' },
];

const photos = [
  {
    id: '1',
    name: 'Dropping the Heart Chute',
    description: 'The heart chute is one of my favorite chutes',
    category: 'ACTION',
    githubUser: 'gPlake',
    created: '3-28-1977',
  },
  {
    id: '2',
    name: 'Enjoying the sunshine',
    category: 'SELFIE',
    githubUser: 'sSchmidt',
    created: '1-2-1985',
  },
  {
    id: '3',
    name: 'Gunbarrel 25',
    description: '25 laps on gunbarrel today',
    category: 'LANDSCAPE',
    githubUser: 'sSchmidt',
    created: '2018-04-15T19:09:57.308Z',
  },
];

module.exports = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
    allUsers: () => users
  },

  Mutation: {
    postPhoto(parent, args) {
      let newPhoto = {
        id: _id++,
        ...args.input,
        created: new Date()
      };

      photos.push(newPhoto);
      return newPhoto;
    },
  },

  Photo: {
    url: (parent) => `http://mysite.com/photo/${parent.id}.svg`,
    postedBy: (parent) => users.find(user => user.githubLogin === parent.githubUser),
    taggedUsers: (parent) => tags.filter(tag => tag.photoID === parent.id)
      .map(tag => users.find(user => user.githubLogin === tag.userID))    
  },

  User: {
    postedPhotos: (parent) => photos.filter(photo => photo.githubUser === parent.githubLogin),
    inPhotos: (parent) => tags.filter(tag => tag.userID === parent.githubLogin)
      .map(tag => photos.find(photo => photo.id === tag.photoID)),
    
  },

  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'Валидное значение даты',
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value
  })
};