const {
  convertTimestampToDate,
  topicDataConverter,
  createLookupObject
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("Tests for topicDataConverter", () => {
  test('Reformats the array of objects into an array of arrays, with each nested array containing the values on the original object', () => {
    const testTopics = [
      {
        description: 'A treat in hot weather',
        slug: 'ice-cream',
        img_url: ""
      },
      {
        description: 'The absolute GOAT of dips',
        slug: 'hummus',
        img_url: ""
      },
      {
        description: "Can you tell I'm peckish?",
        slug: 'picnics',
        img_url: ""
      }
    ];

    const testFormattedTopics = [
      [
        'A treat in hot weather',
        'ice-cream',
        ""
      ],
      [
        'The absolute GOAT of dips',
        'hummus',
        ""
      ],
      [
        "Can you tell I'm peckish?",
        'picnics',
        ""
      ]
    ];

    expect(topicDataConverter(testTopics)).toEqual(testFormattedTopics);
  })
  test('Original array is not mutated', () => {
    const testTopics = [
      {
        description: 'A treat in hot weather',
        slug: 'ice-cream',
        img_url: ""
      },
      {
        description: 'The absolute GOAT of dips',
        slug: 'hummus',
        img_url: ""
      },
      {
        description: "Can you tell I'm peckish?",
        slug: 'picnics',
        img_url: ""
      }
    ];

    const testTopicsCopy = [
      {
        description: 'A treat in hot weather',
        slug: 'ice-cream',
        img_url: ""
      },
      {
        description: 'The absolute GOAT of dips',
        slug: 'hummus',
        img_url: ""
      },
      {
        description: "Can you tell I'm peckish?",
        slug: 'picnics',
        img_url: ""
      }
    ];

    topicDataConverter(testTopics);
    expect(testTopics).toEqual(testTopicsCopy);
  })
})

describe('Tests for createLookupObject', () => {
  test('Returns an empty object when passed an empty array', () => {
    expect(createLookupObject([], "title", "article_id")).toEqual({});
  })
  test('Returns an object with the correct keys and values when passed an array with one object', () => {
    const testRows = [
      {
        article_id: 1,
        title: 'Running a node app',
        topic: 'node',
        author: 'me_innit',
        body: 'please help I cannot computer',
        created_at: '2020-10-11T11:24:00.000Z',
        votes: 2,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }
    ]
    
    const expected = { 
      'Running a node app': 1
    }

    expect(createLookupObject(testRows, "title", "article_id")).toEqual(expected);
  })
  test('Returns an object with the correct keys and values when passed an array with multiple objects', () => {
    const testRows = [
      {
        article_id: 1,
        title: 'Running a node app',
        topic: 'node',
        author: 'me_innit',
        body: 'please help I cannot computer',
        created_at: '2020-10-11T11:24:00.000Z',
        votes: 2,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      },
      {
        article_id: 2,
        title: 'The Rise Of Thinking Machines: How IBMs Watson Takes On The World',
        topic: 'computers',
        author: 'xXc0mput3r_n00bXx',
        body: 'Take a look at this machine!',
        created_at: '2020-10-11T11:24:00.000Z',
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }
    ]

    const expected = { 
      'Running a node app': 1,
      'The Rise Of Thinking Machines: How IBMs Watson Takes On The World': 2
    }

    expect(createLookupObject(testRows, "title", "article_id")).toEqual(expected);
  });
  test('Original array is not mutated', () => {
    const testRows = [
      {
        article_id: 1,
        title: 'Running a node app',
        topic: 'node',
        author: 'me_innit',
        body: 'please help I cannot computer',
        created_at: '2020-10-11T11:24:00.000Z',
        votes: 2,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      },
      {
        article_id: 2,
        title: 'The Rise Of Thinking Machines: How IBMs Watson Takes On The World',
        topic: 'computers',
        author: 'xXc0mput3r_n00bXx',
        body: 'Take a look at this machine!',
        created_at: '2020-10-11T11:24:00.000Z',
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }
    ]

    const testRowsCopy = [
      {
        article_id: 1,
        title: 'Running a node app',
        topic: 'node',
        author: 'me_innit',
        body: 'please help I cannot computer',
        created_at: '2020-10-11T11:24:00.000Z',
        votes: 2,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      },
      {
        article_id: 2,
        title: 'The Rise Of Thinking Machines: How IBMs Watson Takes On The World',
        topic: 'computers',
        author: 'xXc0mput3r_n00bXx',
        body: 'Take a look at this machine!',
        created_at: '2020-10-11T11:24:00.000Z',
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }
    ]

    createLookupObject(testRows, "title", "article_id");
    expect(testRows).toEqual(testRowsCopy);
  })
})