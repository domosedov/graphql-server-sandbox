const { ApolloServer } = require('apollo-server');

let _id = 0;

const tags = [
  { 'photoID': '1', 'userID': 'gPlake'},
  { 'photoID': '2', 'userID': 'sSchmidt'},
  { 'photoID': '2', 'userID': 'mHattrup'},
  { 'photoID': '2', 'userID': 'gPlake'},
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
  },
  {
    id: '2',
    name: 'Enjoying the sunshine',
    category: 'SELFIE',
    githubUser: 'sSchmidt',
  },
  {
    id: '3',
    name: 'Gunbarrel 25',
    description: '25 laps on gunbarrel today',
    category: 'LANDSCAPE',
    githubUser: 'sSchmidt',
  },
];

const typeDefs = `
    type User {
        githubLogin: ID!
        name: String
        avatar: String
        postedPhotos: [Photo!]!
        inPhotos: [Photo!]!
    }

    enum PhotoCategory {
        SELFIE
        PORTRAIT
        ACTION
        LANDSCAPE
        GRAPHIC
    }

    type Photo {
        id: ID!
        url: String!
        name: String!
        description: String
        category: PhotoCategory!
        postedBy: User!
        taggedUsers: [User!]!
    }

    type Query {
        totalPhotos: Int!
        allPhotos: [Photo!]!
        allUsers: [User!]!
    }

    input PostPhotoInput {
        name: String!
        category: PhotoCategory=PORTRAIT
        description: String
    }

    type Mutation {
        """
        Добавление фотографии
        """
        postPhoto(input: PostPhotoInput!): Photo!
    }
`;

const resolvers = {
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
      };

      photos.push(newPhoto);
      return newPhoto;
    },
  },

  Photo: {
    url: (parent) => {
      // console.log(parent);
      return `http://mysite.com/photo/${parent.id}.svg`;
    },
    postedBy: (parent) => users.find(user => user.githubLogin === parent.githubUser),
    taggedUsers: (parent) => tags.filter(tag => tag.photoID === parent.id)
      .map(tag => users.find(user => user.githubLogin === tag.userID))    
  },

  User: {
    postedPhotos: (parent) => photos.filter(photo => photo.githubUser === parent.githubLogin),
    inPhotos: (parent) => {
      console.log(parent);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL server running on ${url}`));
