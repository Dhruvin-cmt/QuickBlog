import type { Category } from "@prisma/client";
import { prisma } from "../../config/database.js";
import type { postBlogData, updateBlogData } from "./blog.validations.js";

export const checkUniqueSlug = async (data: string, id?: string) => {
  const slug = data
    .toLowerCase()
    .trim()
    .replaceAll(" ", "-")
    .replace(/-+/g, "-");
  const result = await prisma.post.findFirst({
    where: { slug: slug, isDeleted: false, ...(id && { NOT: { postId: id } }) },
  });

  return { result, slug };
};

export const getBlogById = async (
  id: string,
  options?: { publishedOnly: boolean }
) => {
  const result = await prisma.post.findFirst({
    where: {
      postId: id,
      isDeleted: false,
      ...(options?.publishedOnly && {
        isPublished: true,
      }),
    },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  return result;
};

export const createBlog = async (
  data: postBlogData,
  slug: string,
  id: string
) => {
  const result = await prisma.post.create({
    data: {
      title: data.title,
      slug: slug,
      slugDisplay: data.slugDisplay,
      body: data.body,
      category: data.category,
      authorId: id,
    },
  });

  return result;
};

export const blogUpdate = async (id: string, newdata: updateBlogData) => {
  const filteredData = Object.fromEntries(
    Object.entries(newdata).filter(([_, value]) => value !== undefined)
  );

  const contentFields = ["title", "slug", "body"];

  const isContentUpdated: boolean = contentFields.some(
    (field) => field in filteredData
  );

  const result = await prisma.post.update({
    where: { postId: id },
    data: {
      ...filteredData,
      ...(isContentUpdated && {
        isEdited: true,
        editCount: {
          increment: 1,
        },
      }),
    },
  });

  return result;
};

export const deleteBlog = async (id: string) => {
  const result = await prisma.post.update({
    where: {
      postId: id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
  return result;
};

export const authorBlogs = async (id: string, page: number, limit: number) => {
  return Promise.all([
    prisma.post.findMany({
      where: { authorId: id, isDeleted: false },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ updatedAt: "desc" }, { postId: "desc" }],
    }),
    prisma.post.count({
      where: { authorId: id, isDeleted: false },
    }),
    prisma.post.count({
      where: { authorId: id, isDeleted: false, isPublished: false },
    }),
  ]);
};

export const findAuthorBlogById = async (authorid: string, id: string) => {
  const result = await prisma.post.findFirst({
    where: {
      postId: id,
      authorId: authorid,
      isDeleted: false,
    },
  });

  return result;
};

export const addCommentCountInPost = async (id: string) => {
  const result = await prisma.post.update({
    where: { postId: id },
    data: {
      commentsCount: {
        increment: 1,
      },
    },
  });

  return result;
};

export const getFilterBlogs = async (
  page: number,
  limit: number,
  search?: string,
  cat?: Category
) => {
  return Promise.all([
    prisma.post.findMany({
      where: {
        ...(cat && {
          category: {
            equals: cat,
          },
        }),
        ...(search && {
          title: {
            contains: search,
            mode: "insensitive",
          },
        }),
        isDeleted: false,
        isPublished: true,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.post.count({
      where: {
        ...(cat && {
          category: {
            equals: cat,
          },
        }),
        ...(search && {
          title: {
            contains: search,
            mode: "insensitive",
          },
        }),
        isDeleted: false,
        isPublished: true,
      },
    }),
  ]);
};
