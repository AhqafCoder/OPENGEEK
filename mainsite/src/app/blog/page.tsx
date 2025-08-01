"use client";

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Calendar, Clock, Tag } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Avatar } from '@/components/ui/avatar'
import { blogPosts, type BlogPost } from './data'

// Helper function to get formatted date
const getFormattedDate = () => {
  return new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// Helper function to get formatted time
const getFormattedTime = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const currentDate = getFormattedDate()
const currentTime = getFormattedTime()

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-neutral-950 to-neutral-950" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-14 mt-10">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-400">
              OpenGeek Blog
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Insights, tutorials, and resources for the next generation of developers.
              Stay updated with the latest in tech and development.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="px-4 py-2 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 cursor-pointer">
              All Posts
            </Badge>
            <Badge className="px-4 py-2 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-400 cursor-pointer">
              Tutorials
            </Badge>
            <Badge className="px-4 py-2 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-400 cursor-pointer">
              Career Guide
            </Badge>
            <Badge className="px-4 py-2 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-400 cursor-pointer">
              Resources
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Post */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`} className="block mb-16 group">
            <div className="grid md:grid-cols-2 gap-8 items-center bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 hover:bg-neutral-900/80 transition-all duration-300">
              <div className="relative h-[350px] rounded-xl overflow-hidden">
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
              </div>
              <div>
                <Badge className="mb-4 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20">
                  Featured Post
                </Badge>
                <h2 className="text-3xl font-bold mb-4 text-neutral-200 group-hover:text-blue-400 transition">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-neutral-400 mb-6">
                  {featuredPost.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPost.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="bg-neutral-800 text-neutral-300 hover:bg-neutral-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <HoverCard>
                    <HoverCardTrigger>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <Avatar className="border-2 border-neutral-700">
                          <Image
                            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop"
                            alt={featuredPost.author}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </Avatar>
                        <span className="text-neutral-300">{featuredPost.author}</span>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="bg-neutral-900 border-neutral-800">
                      <div className="flex flex-col gap-2">
                        <h4 className="font-semibold text-neutral-200">{featuredPost.author}</h4>
                        <p className="text-sm text-neutral-400">Technical Writer & Developer</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <span className="text-sm text-neutral-500">•</span>
                  <time className="text-sm text-neutral-400">{featuredPost.date}</time>
                  <span className="text-sm text-neutral-500">•</span>
                  <span className="text-sm text-neutral-400">{featuredPost.readingTime}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Regular Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="h-full group hover:shadow-xl transition-all duration-300 bg-neutral-900/50 border-neutral-800 hover:bg-neutral-900/80">
                <div className="relative h-44">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent rounded-t-lg" />
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-neutral-800 text-neutral-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-neutral-200 group-hover:text-blue-400 transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-neutral-400">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-neutral-700">
                        <Image
                          src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop"
                          alt={post.author}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      </Avatar>
                      <span>{post.author}</span>
                    </div>
                    <span>{post.readingTime}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-neutral-200 mb-4">
              Stay Updated with OpenGeek
            </h3>
            <p className="text-neutral-400 mb-6">
              Get the latest articles, tutorials, and resources delivered directly to your inbox.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500"
              />
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 