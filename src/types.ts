export interface IUserData {
  email?: string
  userName?: string
  avatar?: string
  id?: string
  followers?: any
  following?: any
  likedPosts?: string[]
}
export interface IPostData {
  authorId: string
  text: string
  id: string
  imageUrl: string
  userName: string
  avatar: string
  createdAt: any
  likes: string[]
}
export interface IStoriesData {
  authorId: string
  text: string
  id: string
  imageUrl: string
  userName: string
  avatar: string
  createdAt: any
}
