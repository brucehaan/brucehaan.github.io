import React, { FunctionComponent } from 'react'
import { graphql } from 'gatsby'
import Template from 'components/Common/Template'
import PostHead from 'components/Post/PostHead'
import PostContent from 'components/Post/PostContent'

type PostTemplateProps = {
  data: {
    markdownRemark?: {
      html: string
      frontmatter: {
        title: string
        summary?: string
        date?: string
        categories?: string[]
        thumbnail?: {
          childImageSharp?: {
            gatsbyImageData: any
          }
        }
      }
    } | null
  }
}

const PostTemplate: FunctionComponent<PostTemplateProps> = function ({ data }) {
  const post = data?.markdownRemark
  if (!post) return null

  const { html, frontmatter } = post
  const title = frontmatter?.title ?? ''
  const date = frontmatter?.date || ''
  const categories = frontmatter?.categories ?? []
  const thumbnailImg = frontmatter?.thumbnail?.childImageSharp?.gatsbyImageData

  return (
    <Template>
      <PostHead
        title={title}
        date={date}
        categories={categories}
        thumbnail={thumbnailImg}
      />
      <PostContent html={html} />
    </Template>
  )
}


export default PostTemplate

export const queryMarkdownDataBySlug = graphql`
  query PostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        summary
        date(formatString: "YYYY.MM.DD.")
        categories
        thumbnail {
          childImageSharp {
            gatsbyImageData(width: 1200)
          }
        }
      }
    }
  }
`