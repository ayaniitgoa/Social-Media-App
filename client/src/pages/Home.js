import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { FETCH_POSTS_QUERY } from '../utils/graphql';
import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data, error } = useQuery(FETCH_POSTS_QUERY);

  if (loading) {
    return (
      <div className='ui active transition visible dimmer'>
        <div className='content'>
          <div className='ui loader'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return 'Error :(';
  }

  return (
    <div className=''>
      {user && <PostForm />}
      <h1>Recent Posts</h1>
      <div className='cards'>
        {data.getPosts &&
          data.getPosts.map((post) => (
            <div key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Home;
