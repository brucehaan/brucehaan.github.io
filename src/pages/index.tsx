import React, { FunctionComponent, useMemo } from 'react'
import styled from '@emotion/styled'
import GlobalStyle from 'components/Common/GlobalStyle'
import Footer from 'components/Common/Footer'
import CategoryList from 'components/Main/CategoryList'
import Introduction from 'components/Main/Introduction'
import PostList, { PostType } from 'components/Main/PostList'
import { graphql } from 'gatsby'
import { IGatsbyImageData } from 'gatsby-plugin-image'
import { PostListItemType } from 'types/PostItem.types'
import queryString, { ParsedQuery } from 'query-string'
import Template from 'components/Common/Template'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

type IndexPageProps = {
  location: {
    search: string
  }
  data: {
    site: {
      siteMetadata: {
        title: string
        description: string
        siteUrl: string
      }
    }
    allMarkdownRemark: {
      edges: PostListItemType[]
    }
    file?: {
      childImageSharp?: {
        gatsbyImageData: IGatsbyImageData
      }
      publicURL?: string
    } | null
  }
}

const IndexPage: FunctionComponent<IndexPageProps> = function ({
  location: { search },
  data,
}) {
  const {
    site: {
      siteMetadata: { title, description, siteUrl },
    },
    allMarkdownRemark: { edges },
    file,
  } = data
  const gatsbyImageData = file?.childImageSharp?.gatsbyImageData
  const publicURL = file?.publicURL || ''
  const parsed: ParsedQuery<string> = queryString.parse(search)
  const selectedCategory: string =
    typeof parsed.category !== 'string' || !parsed.category
      ? 'All'
      : parsed.category

  const categoryList = useMemo(() => {
    return edges.reduce((list: Record<string, number>, {
      node: { frontmatter: { categories } },
    }: PostType) => {
      categories.forEach(category => {
        if (list[category] === undefined) list[category] = 1
        else list[category]++
      })

      list['All']++
      return list
    }, { All: 0 } as Record<string, number>)
  }, [edges])

   return (
    <Template
      title={title}
      description={description}
      url={siteUrl}
      image={publicURL}
    >
      {gatsbyImageData && <Introduction profileImage={gatsbyImageData} />}
      <CategoryList
        selectedCategory={selectedCategory}
        categoryList={categoryList}
      />
      <PostList selectedCategory={selectedCategory} posts={edges} />
    </Template>
  )
}

export default IndexPage

export const getPostList = graphql`
  query getPostList {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date, frontmatter___title] }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            categories
            thumbnail {
              childImageSharp {
                gatsbyImageData(width: 768, height: 400)
              }
            }
          }
        }
      }
    }
    file(name: { eq: "profile-image" }) {
      childImageSharp {
        gatsbyImageData(width: 120, height: 120)
      }
      publicURL
    }
  }
`