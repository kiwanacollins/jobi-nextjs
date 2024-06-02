import React from 'react'
import BlogItem from './BlogItem'
import { IBlog } from '@/database/Blog.model'

interface IBlogsProps {
    blogs: IBlog[]
}

const BlogsTable = ({blogs}:IBlogsProps) => {
  return (
    <div className="table-responsive">
    <table className="table job-alert-table">
      <thead>
        <tr>
          <th scope="col">No</th>
          <th scope="col">Image</th>
          <th scope="col">Title</th>
          <th scope="col">last update</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody className="border-0">
        {blogs?.map((blog, index) => {
            return (
                <BlogItem
                key={blog._id}
                  blogId={blog._id as string}
                  serial={index + 1}
                  title={blog.title}
                  image={blog.image.url}
                  updatedAt={blog.updatedAt as Date}
                />
              )
        })}

        {blogs.length === 0 && (
          <tr>
            <td colSpan={5} className="text-center">
              No results found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  )
}

export default BlogsTable