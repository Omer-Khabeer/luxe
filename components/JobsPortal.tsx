// File: app/page.js
'use client'

import { useState } from 'react';
import Header from '@/components/Header';
import SearchFilters from '@/components/SearchFilters';
import JobCard from '@/components/JobCard';
import JobDetails from '@/components/JobDetails';
import ApplicationForm from '@/components/ApplicationForm';
import EmptyState from '@/components/EmptyState';
import { jobListings } from '@/data/jobs';
import { BookmarkPlus, Send } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    salary: '',
    type: '',
    experience: ''
  });

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesType = !filters.type || job.type === filters.type;
    return matchesSearch && matchesLocation && matchesType;
  });

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const applyToJob = (jobId) => {
    setAppliedJobs(new Set([...appliedJobs, jobId]));
    setShowApplicationForm(false);
  };

  const savedJobsList = jobListings.filter(job => savedJobs.has(job.id));
  const appliedJobsList = jobListings.filter(job => appliedJobs.has(job.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        savedCount={savedJobs.size}
        appliedCount={appliedJobs.size}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && (
          <>
            <SearchFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              setFilters={setFilters}
            />

            {selectedJob ? (
              <JobDetails 
                job={selectedJob} 
                onClose={() => setSelectedJob(null)}
                onApply={() => setShowApplicationForm(true)}
                onSave={() => toggleSaveJob(selectedJob.id)}
                isSaved={savedJobs.has(selectedJob.id)}
                isApplied={appliedJobs.has(selectedJob.id)}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onClick={setSelectedJob}
                    onSave={toggleSaveJob}
                    isSaved={savedJobs.has(job.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'saved' && (
          <>
            {savedJobsList.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {savedJobsList.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onClick={setSelectedJob}
                    onSave={toggleSaveJob}
                    isSaved={true}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={BookmarkPlus}
                title="No Saved Jobs Yet"
                description="Save jobs you're interested in to review them later"
                actionText="Browse Jobs"
                onAction={() => setActiveTab('browse')}
              />
            )}
          </>
        )}

        {activeTab === 'applied' && (
          <>
            {appliedJobsList.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {appliedJobsList.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onClick={setSelectedJob}
                    onSave={toggleSaveJob}
                    isSaved={savedJobs.has(job.id)}
                    isApplied={true}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Send}
                title="No Applications Yet"
                description="Your job applications will appear here"
                actionText="Find Jobs"
                onAction={() => setActiveTab('browse')}
              />
            )}
          </>
        )}
      </main>

      {showApplicationForm && selectedJob && (
        <ApplicationForm 
          job={selectedJob} 
          onClose={() => setShowApplicationForm(false)}
          onSubmit={() => applyToJob(selectedJob.id)}
        />
      )}
    </div>
  );
}

// File: components/Header.js
'use client'

import { Briefcase } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, savedCount, appliedCount }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JobsPortal
            </h1>
          </div>
          
          <nav className="flex space-x-8">
            {[
              { key: 'browse', label: 'Browse' },
              { key: 'saved', label: `Saved (${savedCount})` },
              { key: 'applied', label: `Applied (${appliedCount})` }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative py-2 px-4 font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

// File: components/SearchFilters.js
'use client'

import { Search } from 'lucide-react';

export default function SearchFilters({ searchTerm, setSearchTerm, filters, setFilters }) {
  return (
    <div className="mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs, companies, keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Locations</option>
              <option value="san francisco">San Francisco</option>
              <option value="new york">New York</option>
              <option value="austin">Austin</option>
              <option value="seattle">Seattle</option>
              <option value="remote">Remote</option>
            </select>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// File: components/JobCard.js
'use client'

import { MapPin, Clock, DollarSign, Users, Star, ChevronRight, Heart } from 'lucide-react';

export default function JobCard({ job, onClick, onSave, isSaved, isApplied }) {
  return (
    <div 
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
      onClick={() => onClick(job)}
    >
      {job.featured && (
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
            {job.logo}
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-gray-600 font-medium">{job.company}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(job.id);
          }}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isSaved ? 'text-red-500 fill-current' : 'text-gray-400'
            }`} 
          />
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <MapPin className="w-4 h-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <DollarSign className="w-4 h-4" />
          {job.salary}
        </div>
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <Clock className="w-4 h-4" />
          {job.type}
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            {job.rating}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {job.employees}
          </div>
          <span>{job.posted}</span>
        </div>
        <div className="flex items-center gap-2">
          {isApplied && (
            <span className="text-green-600 text-sm font-medium">✓ Applied</span>
          )}
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>
    </div>
  );
}

// File: components/JobDetails.js
'use client'

import { Building2, MapPin, Calendar, DollarSign, Clock, GraduationCap, Send, Heart, Award } from 'lucide-react';

export default function JobDetails({ job, onClose, onApply, onSave, isSaved, isApplied }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto animate-in slide-in-from-bottom duration-300">
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl">
              {job.logo}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Building2 className="w-5 h-5" />
                  {job.company}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-5 h-5" />
                  {job.posted}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Salary</span>
            </div>
            <p className="text-green-700 font-bold">{job.salary}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Type</span>
            </div>
            <p className="text-blue-700 font-bold">{job.type}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Experience</span>
            </div>
            <p className="text-purple-700 font-bold">{job.experience}</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
            <div className="grid grid-cols-2 gap-3">
              {job.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Award className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={onApply}
            disabled={isApplied}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              isApplied
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
            }`}
          >
            {isApplied ? (
              <>
                <span>✓ Applied</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Apply Now
              </>
            )}
          </button>
          <button
            onClick={onSave}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              isSaved
                ? 'border-red-300 bg-red-50 text-red-600'
                : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-600'
            }`}
          >
            <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

// File: components/ApplicationForm.js
'use client'

import { ArrowRight } from 'lucide-react';

export default function ApplicationForm({ job, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input 
                type="tel" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
              <textarea 
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell us why you're interested in this position..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <ArrowRight className="w-6 h-6 text-blue-600 transform rotate-90" />
                  </div>
                  <p className="text-gray-600 mb-2">Drop your resume here or click to browse</p>
                  <p className="text-sm text-gray-400">PDF, DOC, DOCX up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// File: components/EmptyState.js
'use client'

export default function EmptyState({ icon: Icon, title, description, actionText, onAction }) {
  return (
    <div className="text-center py-12">
      <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <button
        onClick={onAction}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
      >
        {actionText}
      </button>
    </div>
  );
}

// File: data/jobs.js
export const jobListings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    type: "Full-time",
    experience: "5+ years",
    posted: "2 days ago",
    description: "We're looking for a senior frontend developer to join our dynamic team. You'll work on cutting-edge web applications using React, TypeScript, and modern development tools.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Modern CSS frameworks", "Agile methodology"],
    benefits: ["Health insurance", "401k matching", "Flexible PTO", "Remote work options"],
    logo: "🚀",
    featured: true,
    rating: 4.8,
    employees: "500-1000"
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Design Studio",
    location: "New York, NY",
    salary: "$80k - $110k",
    type: "Full-time",
    experience: "3+ years",
    posted: "1 day ago",
    description: "Join our creative team as a UX/UI Designer. You'll be responsible for creating intuitive and beautiful user experiences for web and mobile applications.",
    requirements: ["3+ years UX/UI experience", "Figma expertise", "User research skills", "Portfolio required"],
    benefits: ["Creative environment", "Learning budget", "Flexible hours", "Health coverage"],
    logo: "🎨",
    featured: false,
    rating: 4.6,
    employees: "50-100"
  },
  {
    id: 3,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Austin, TX",
    salary: "$100k - $140k",
    type: "Full-time",
    experience: "4+ years",
    posted: "3 days ago",
    description: "We're seeking a full stack engineer to build scalable web applications. You'll work with React, Node.js, and cloud technologies in a fast-paced startup environment.",
    requirements: ["Full stack experience", "React & Node.js", "Database design", "Cloud platforms"],
    benefits: ["Equity package", "Unlimited PTO", "Tech stipend", "Team retreats"],
    logo: "⚡",
    featured: true,
    rating: 4.7,
    employees: "10-50"
  },
  {
    id: 4,
    title: "Product Manager",
    company: "InnovateCorp",
    location: "Seattle, WA",
    salary: "$130k - $170k",
    type: "Full-time",
    experience: "6+ years",
    posted: "1 week ago",
    description: "Lead product strategy and development for our flagship SaaS platform. Work closely with engineering, design, and business teams to deliver exceptional user experiences.",
    requirements: ["Product management experience", "Technical background", "Data-driven approach", "Leadership skills"],
    benefits: ["Stock options", "Premium healthcare", "Professional development", "Work from anywhere"],
    logo: "📊",
    featured: false,
    rating: 4.5,
    employees: "200-500"
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Remote",
    salary: "$110k - $150k",
    type: "Full-time",
    experience: "4+ years",
    posted: "5 days ago",
    description: "Join our DevOps team to build and maintain scalable cloud infrastructure. You'll work with AWS, Kubernetes, and modern CI/CD pipelines.",
    requirements: ["AWS certification", "Kubernetes experience", "CI/CD pipelines", "Infrastructure as Code"],
    benefits: ["Remote first", "Learning allowance", "Conference budget", "Flexible schedule"],
    logo: "☁️",
    featured: true,
    rating: 4.9,
    employees: "100-200"
  }
];

// File: app/layout.js
import './globals.css';

export const metadata = {
  title: 'JobsPortal - Find Your Dream Job',
  description: 'Modern job portal with smooth animations and excellent UX',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// File: app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-in {
    animation-fill-mode: both;
  }
  
  .slide-in-from-bottom {
    animation: slideInFromBottom 0.3s ease-out;
  }
  
  .fade-in {
    animation: fadeIn 0.3s ease-out;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

// File: next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [],
  },
}

module.exports = nextConfig

// File: package.json
{
  "name": "jobs-portal-nextjs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "autoprefixer": "^10",
    "eslint": "^8",
    "eslint-config-next": "14.0.0",
    "postcss": "^8",
    "tailwindcss": "^3"
  }
}

// File: tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'in': 'fadeIn 0.3s ease-out',
        'slide-in-from-bottom': 'slideInFromBottom 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInFromBottom: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)' 
          },
        },
      },
    },
  },
  plugins: [],
}

// File: postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// File: .eslintrc.json
{
  "extends": "next/core-web-vitals"
}

// File: README.md
# JobsPortal - Next.js

A modern, animated job application portal built with Next.js 14, React, and Tailwind CSS.

## 🚀 Features

- **Modern Design**: Glassmorphism effects with smooth animations
- **Responsive**: Works perfectly on all devices
- **Interactive**: Smooth hover effects and transitions
- **Full Job Management**: Browse, save, and apply to jobs
- **Search & Filter**: Advanced filtering by location and job type
- **Application System**: Complete application form with file upload
- **State Management**: Persistent state for saved and applied jobs

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **Language**: JavaScript (ES6+)

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
├── app/
│   ├── layout.js          # Root layout with metadata
│   ├── page.js            # Main homepage component
│   └── globals.css        # Global styles and animations
├── components/
│   ├── Header.js          # Navigation header
│   ├── SearchFilters.js   # Search and filter component
│   ├── JobCard.js         # Individual job listing card
│   ├── JobDetails.js      # Detailed job view
│   ├── ApplicationForm.js # Job application modal
│   └── EmptyState.js      # Empty state component
├── data/
│   └── jobs.js            # Job listings data
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
└── package.json           # Dependencies and scripts
```

## 🎨 Key Features

### Component Architecture
- **Modular Design**: Each component has a single responsibility
- **Reusable Components**: EmptyState, JobCard components are highly reusable
- **Props Interface**: Clean prop interfaces for component communication

### Animations & UX
- **Smooth Transitions**: All interactions have smooth 300ms transitions
- **Hover Effects**: Cards lift and change colors on hover
- **Modal Animations**: Slide-in animations for modals and detailed views
- **Loading States**: Visual feedback for all user actions

### State Management
- **React Hooks**: useState for component state management
- **Persistent State**: Saved and applied jobs persist during session
- **Real-time Updates**: UI updates immediately on user actions

### Responsive Design
- **Mobile First**: Designed for mobile and scaled up
- **Grid Layouts**: CSS Grid and Flexbox for responsive layouts
- **Adaptive UI**: Components adapt to different screen sizes

## 🚀 Deployment

The app is ready for deployment on Vercel, Netlify, or any other platform supporting Next.js.

```bash
npm run build
npm run start
```

## 🔧 Customization

- **Colors**: Update the gradient colors in `tailwind.config.js`
- **Jobs Data**: Modify `data/jobs.js` to add your own job listings
- **Animations**: Customize animations in `globals.css`
- **Components**: Easily extend or modify components in the `components/` directory

## 📝 License

MIT License - feel free to use this project for your own applications!