const cache = new Map();

const set = (key, value, ttl = 60000) => {
  const expires = Date.now() + ttl;
  cache.set(key, { value, expires });
};

const get = (key) => {
  const cached = cache.get(key);
  if (!cached) {
    return null;
  }

  if (Date.now() > cached.expires) {
    cache.delete(key);
    return null;
  }

  return cached.value;
};

const del = (key) => {
  cache.delete(key);
};

const clear = () => {
  cache.clear();
};

export default {
  set,
  get,
  del,
  clear,
};