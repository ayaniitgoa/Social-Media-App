import React, { useContext } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import DeleteButton from './DeleteButton';
import LikeButton from './LikeButton';
import { AuthContext } from '../context/auth';
function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
  const { user } = useContext(AuthContext);

  function userName() {
    if (user) {
      if (user.username === username) {
        return 'You';
      } else {
        return username;
      }
    }
    return username;
  }

  return (
    <div className='card card-home'>
      <h4 className='card-header text-success'>{userName()}</h4>
      <div className='card-body home-card'>
        <Link to={`/posts/${id}`}>
          <h6 className='card-subtitle mb-2 text-muted'>
            {moment(createdAt).fromNow(true)}
          </h6>
        </Link>
        <div className='card-body'>
          <h5 className='card-text text-success'>{body}</h5>
        </div>
      </div>
      <div className='card-footer bg-transparent d-flex'>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <Link to={`/posts/${id}`}>
          <button className='btn btn-outline-primary'>
            <i className='fas fa-comments'></i> {commentCount}
          </button>
        </Link>
        {/* <button className='btn btn-danger float-right'>
          <i className='fas fa-trash'></i>
        </button> */}{' '}
        {/* {deleteButton()} */}
        {user && user.username === username && (
          <DeleteButton postId={id} username={username} user={user} />
        )}
      </div>
    </div>

    // <Card fluid>
    //   <Card.Content>
    //     <Image
    //       floated='right'
    //       size='mini'
    //       src='https://react.semantic-ui.com/images/avatar/large/molly.png'
    //     />
    //     <Card.Header>{username}</Card.Header>
    //     <Card.Meta as={Link} to={`/posts/${id}`}>
    //       {moment(createdAt).fromNow(true)}
    //     </Card.Meta>
    //     <Card.Description>{body}</Card.Description>
    //   </Card.Content>
    //   <Card.Content extra>
    //     <Button as='div' labelPosition='right' onClick={likePost}>
    //       <Button color='red' basic>
    //         <Icon name='heart' />
    //       </Button>
    //       <Label as='a' basic color='red' pointing='left'>
    //         {likeCount}
    //       </Label>
    //     </Button>
    //     <Button as='div' labelPosition='right' onClick={commentOnPost}>
    //       <Button color='blue' basic>
    //         <Icon name='comments' />
    //       </Button>
    //       <Label as='a' basic color='blue' pointing='left'>
    //         {commentCount}
    //       </Label>
    //     </Button>
    //   </Card.Content>
    // </Card>
  );
}

export default PostCard;
