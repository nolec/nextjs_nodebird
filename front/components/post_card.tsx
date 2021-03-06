import {
  EllipsisOutlined,
  HeartOutlined,
  HeartTwoTone,
  MessageOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Comment, List, Popover } from "antd";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { REMOVE_POST_REQUEST } from "../types/post.types";
import CommentForm from "./comment_form";
import FollowButton from "./follow_btn";
import PostCardContent from "./post_card_content";
import PostImages from "./post_images";

interface IPostCardProps {
  post: any;
}

const PostCard: React.FC<IPostCardProps> = ({ post }) => {
  const dispatch = useDispatch();
  const id = useSelector((state: any) => state.user.me?.id);
  const { removePostLoading } = useSelector((state: any) => state.post);

  const [liked, setLiked] = useState(false);
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const onToggleLike = useCallback(() => {
    setLiked((prev) => !prev);
  }, []);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, []);
  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key={"retweet"} />,
          liked ? (
            <HeartTwoTone
              twoToneColor={"#eb2f96"}
              key={"heart"}
              onClick={onToggleLike}
            />
          ) : (
            <HeartOutlined key={"heart"} onClick={onToggleLike} />
          ),
          <MessageOutlined key={"comment"} onClick={onToggleComment} />,
          <Popover
            key={"more"}
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button
                      type={"dashed"}
                      loading={removePostLoading}
                      onClick={onRemovePost}
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        extra={id && <FollowButton post={post} />}
      >
        <Card.Meta
          avatar={<Avatar>{post.User?.nickname[0]}</Avatar>}
          title={post.User?.nickname}
          description={<PostCardContent postData={post.content} />}
        />
      </Card>
      {commentFormOpened && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length} 개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item: any) => (
              <li>
                <Comment
                  author={item.User?.nickname}
                  avatar={<Avatar>{item.User?.nickname[0]}</Avatar>}
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};
export default PostCard;
