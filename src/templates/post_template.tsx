import React, { FunctionComponent } from 'react'
import { graphql } from 'gatsby'
import Template from 'components/Common/Template'
import PostHead from 'components/Post/PostHead'
import PostContent from 'components/Post/PostContent'
import CommentWidget from 'components/Post/CommentWidget'
import { PostFrontmatterType } from 'types/PostItem.types'

type PostTemplateProps = {
  data: {
    allMarkdownRemark: {
      edges: PostPageItemType[]
    }
  }
  location: {
    href: string
  }
}

type PostPageItemType = {
  node: {
    html: string
    frontmatter: PostFrontmatterType
  }
}

const PostTemplate: FunctionComponent<PostTemplateProps> = function ({
  data: {
    allMarkdownRemark: { edges },
  },
  location: { href },
}) {
  if (!edges || edges.length === 0) return null;

  const {
    node: { html, frontmatter },
  } = edges[0]!;
  const { title, summary, date, categories, thumbnail } = frontmatter;
  const gatsbyImageData = thumbnail?.childImageSharp?.gatsbyImageData;
  const publicURL = thumbnail?.publicURL;

  return (
    <Template title={title} description={summary} url={href} image={publicURL || ''}>
      <PostHead
        title={title}
        date={date}
        categories={categories}
        {...(gatsbyImageData ? { thumbnail: gatsbyImageData } : {})}
      />
      <PostContent html={html} />
      <CommentWidget />
    </Template>
  )
}

export default PostTemplate

export const queryMarkdownDataBySlug = graphql`
  query queryMarkdownDataBySlug($slug: String) {
    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          html
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            categories
            thumbnail {
              childImageSharp {
                gatsbyImageData
              }
              publicURL
            }
          }
        }
      }
    }
  }
`