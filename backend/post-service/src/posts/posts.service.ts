import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPost(title: string, body: string, authorId: string) {
    const post = new this.postModel({ title, body, authorId });
    return post.save();
  }

  async getAllPosts() {
    return this.postModel.find().exec();
  }

  async getPostById(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async deletePost(id: string, userId: string) {
    const post = await this.postModel.findOneAndDelete({ _id: id, authorId: userId });
    if (!post) throw new NotFoundException('Post not found or unauthorized');
    return post;
  }
}
