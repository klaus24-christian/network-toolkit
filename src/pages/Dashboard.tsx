
import { Link } from 'react-router-dom';
import { Calculator, Shield, Radio, GitBranch, Activity, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const Dashboard = () => {
  const { user } = useAuth();

  const tools = [
    {
      icon: Calculator,
      title: 'Subnet Calculator',
      description: 'Calculate subnet masks, network addresses, and host ranges',
      path: '/subnet',
      color: 'bg-blue-500',
      stats: 'Most Used'
    },
    {
      icon: Shield,
      title: 'IP Tools',
      description: 'Validate, lookup, and analyze IP addresses',
      path: '/ip-tools',
      color: 'bg-purple-500',
      stats: 'Essential'
    },
    {
      icon: Radio,
      title: 'Port Scanner',
      description: 'Scan and identify open ports on target hosts',
      path: '/scanner',
      color: 'bg-orange-500',
      stats: 'Advanced'
    },
    {
      icon: GitBranch,
      title: 'Network Diagram',
      description: 'Create and visualize network topology diagrams',
      path: '/diagram',
      color: 'bg-green-500',
      stats: 'New'
    }
  ];

  const stats = [
    { label: 'Total Calculations', value: '1,234', icon: Activity, change: '+12%' },
    { label: 'Saved Subnets', value: '45', icon: Calculator, change: '+5%' },
    { label: 'Scans Performed', value: '89', icon: Radio, change: '+23%' },
    { label: 'Network Diagrams', value: '12', icon: GitBranch, change: '+8%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your professional network toolkit for subnet calculations, IP analysis, and network management.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={item}>
              <Card className="relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <stat.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Network Tools
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        >
          {tools.map((tool, index) => (
            <motion.div key={index} variants={item}>
              <Link to={tool.path}>
                <Card hover className="h-full group">
                  <div className="flex items-start space-x-4">
                    <div className={`p-4 rounded-xl ${tool.color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                      <tool.icon className="w-8 h-8 text-white" style={{ filter: 'brightness(0.8)' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {tool.title}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                          {tool.stats}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              💡 Quick Tips
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Use the Subnet Calculator to quickly determine network ranges and host counts</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>IP Tools can validate addresses and perform geolocation lookups</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Port Scanner helps identify open services on network devices</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Create visual network diagrams to document your infrastructure</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
