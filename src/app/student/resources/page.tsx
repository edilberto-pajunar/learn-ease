'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Headphones,
  PenTool,
  Search,
  Filter,
  Clock,
  Star,
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  category: 'vocabulary' | 'grammar' | 'pronunciation'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  tags: string[]
  url: string
  rating: number
}

const resources: Resource[] = [
  // Vocabulary Resources
  {
    id: 'vocab-1',
    title: 'Essential Academic Vocabulary',
    description:
      'Master the most important academic words used in educational contexts. Perfect for improving your reading comprehension and writing skills.',
    category: 'vocabulary',
    difficulty: 'intermediate',
    duration: '15 min read',
    tags: ['academic', 'reading', 'writing'],
    url: '#',
    rating: 4.8,
  },
  {
    id: 'vocab-2',
    title: 'Business English Vocabulary',
    description:
      'Learn essential business terms and phrases that will help you communicate effectively in professional settings.',
    category: 'vocabulary',
    difficulty: 'intermediate',
    duration: '20 min read',
    tags: ['business', 'professional', 'communication'],
    url: '#',
    rating: 4.6,
  },
  {
    id: 'vocab-3',
    title: 'Daily Conversation Words',
    description:
      'Expand your everyday vocabulary with commonly used words and phrases for natural conversations.',
    category: 'vocabulary',
    difficulty: 'beginner',
    duration: '10 min read',
    tags: ['conversation', 'daily', 'casual'],
    url: '#',
    rating: 4.9,
  },
  {
    id: 'vocab-4',
    title: 'Advanced Vocabulary Builder',
    description:
      'Challenge yourself with sophisticated vocabulary that will make your language more expressive and precise.',
    category: 'vocabulary',
    difficulty: 'advanced',
    duration: '25 min read',
    tags: ['advanced', 'sophisticated', 'precise'],
    url: '#',
    rating: 4.7,
  },

  // Grammar Resources
  {
    id: 'grammar-1',
    title: 'Basic Grammar Rules',
    description:
      'A comprehensive guide to fundamental English grammar rules including parts of speech and sentence structure.',
    category: 'grammar',
    difficulty: 'beginner',
    duration: '30 min read',
    tags: ['basics', 'structure', 'fundamentals'],
    url: '#',
    rating: 4.8,
  },
  {
    id: 'grammar-2',
    title: 'Tense Mastery',
    description:
      'Master all English tenses with clear explanations, examples, and practice exercises for perfect timing in your speech.',
    category: 'grammar',
    difficulty: 'intermediate',
    duration: '45 min read',
    tags: ['tenses', 'timing', 'practice'],
    url: '#',
    rating: 4.5,
  },
  {
    id: 'grammar-3',
    title: 'Advanced Grammar Patterns',
    description:
      'Explore complex grammatical structures including conditionals, passive voice, and subjunctive mood.',
    category: 'grammar',
    difficulty: 'advanced',
    duration: '40 min read',
    tags: ['complex', 'patterns', 'advanced'],
    url: '#',
    rating: 4.6,
  },
  {
    id: 'grammar-4',
    title: 'Common Grammar Mistakes',
    description:
      'Identify and avoid the most common grammar errors that English learners make.',
    category: 'grammar',
    difficulty: 'intermediate',
    duration: '20 min read',
    tags: ['mistakes', 'corrections', 'avoidance'],
    url: '#',
    rating: 4.7,
  },

  // Pronunciation Resources
  {
    id: 'pron-1',
    title: 'Phonetic Alphabet Guide',
    description:
      'Learn the International Phonetic Alphabet (IPA) to understand and improve your pronunciation of any English word.',
    category: 'pronunciation',
    difficulty: 'beginner',
    duration: '35 min read',
    tags: ['IPA', 'phonetics', 'sounds'],
    url: '#',
    rating: 4.9,
  },
  {
    id: 'pron-2',
    title: 'Stress and Intonation',
    description:
      'Master word stress, sentence stress, and intonation patterns to sound more natural and expressive.',
    category: 'pronunciation',
    difficulty: 'intermediate',
    duration: '25 min read',
    tags: ['stress', 'intonation', 'natural'],
    url: '#',
    rating: 4.6,
  },
  {
    id: 'pron-3',
    title: 'Difficult Sounds Practice',
    description:
      "Focus on challenging English sounds like 'th', 'r', and vowel variations with detailed practice exercises.",
    category: 'pronunciation',
    difficulty: 'intermediate',
    duration: '30 min read',
    tags: ['difficult', 'sounds', 'practice'],
    url: '#',
    rating: 4.5,
  },
  {
    id: 'pron-4',
    title: 'Connected Speech',
    description:
      'Learn how words connect in natural speech, including linking, assimilation, and elision patterns.',
    category: 'pronunciation',
    difficulty: 'advanced',
    duration: '20 min read',
    tags: ['connected', 'linking', 'natural'],
    url: '#',
    rating: 4.4,
  },
]

const categories = [
  { id: 'all', name: 'All Resources', icon: BookOpen },
  { id: 'vocabulary', name: 'Vocabulary', icon: BookOpen },
  { id: 'grammar', name: 'Grammar', icon: PenTool },
  { id: 'pronunciation', name: 'Pronunciation', icon: Headphones },
]

const difficulties = ['all', 'beginner', 'intermediate', 'advanced']

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      selectedCategory === 'all' || resource.category === selectedCategory
    const matchesDifficulty =
      selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      )

    return matchesCategory && matchesDifficulty && matchesSearch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vocabulary':
        return <BookOpen className="w-4 h-4" />
      case 'grammar':
        return <PenTool className="w-4 h-4" />
      case 'pronunciation':
        return <Headphones className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Learning Resources
        </h1>
        <p className="text-gray-600">
          Explore articles and guides to improve your vocabulary, grammar, and
          pronunciation skills.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <category.icon className="w-4 h-4" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Difficulty Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Difficulty:
          </span>
          {difficulties.map((difficulty) => (
            <Button
              key={difficulty}
              variant={
                selectedDifficulty === difficulty ? 'default' : 'outline'
              }
              size="sm"
              onClick={() => setSelectedDifficulty(difficulty)}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredResources.length} of {resources.length} resources
        </p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card
            key={resource.id}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-blue-600">
                  {getCategoryIcon(resource.category)}
                  <span className="text-sm font-medium capitalize">
                    {resource.category}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{resource.rating}</span>
                </div>
              </div>
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {resource.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {resource.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Difficulty and Duration */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}
                  >
                    {resource.difficulty.charAt(0).toUpperCase() +
                      resource.difficulty.slice(1)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {resource.duration}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  onClick={() => window.open(resource.url, '_blank')}
                >
                  Start Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No resources found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find what you're
            looking for.
          </p>
        </div>
      )}
    </div>
  )
}
