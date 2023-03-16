async function test() {
  const form = new FormData();
  form.append(
    'operations',
    '{ "query": "mutation ($poster: Upload) { createPost(id: 5, poster: $poster) { id } }", "variables": { "poster": null } }',
  );
  form.append('map', '{ "0": ["variables.poster"] }');
  form.append('0', File(['<data goes here>'], 'test.csv'));

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    body: form,
  });
}

test();
