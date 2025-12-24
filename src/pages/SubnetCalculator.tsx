import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Calculator, Save, Copy, Check } from 'lucide-react';
import { subnetService } from '@services/subnetService';
import type { SubnetResult } from '../types';
import { motion } from 'framer-motion';

export const SubnetCalculator = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [subnetMask, setSubnetMask] = useState('255.255.255.0');
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const commonMasks = [
    { label: '/24 (255.255.255.0)', value: '255.255.255.0' },
    { label: '/16 (255.255.0.0)', value: '255.255.0.0' },
    { label: '/8 (255.0.0.0)', value: '255.0.0.0' },
    { label: '/30 (255.255.255.252)', value: '255.255.255.252' },
    { label: '/29 (255.255.255.248)', value: '255.255.255.248' },
    { label: '/28 (255.255.255.240)', value: '255.255.255.240' },
  ];

  const handleCalculate = async () => {
    setError('');
    setResult(null);

    if (!ipAddress || !subnetMask) {
      setError('Please enter both IP address and subnet mask');
      return;
    }

    setIsLoading(true);
    try {
      const data = await subnetService.calculate({ ipAddress, subnetMask });
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate subnet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    try {
      await subnetService.save(result);
      alert('Subnet calculation saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to save subnet');
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const ResultRow = ({ label, value, field }: { label: string; value: string; field: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </span>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
          {value}
        </span>
        <button
          onClick={() => copyToClipboard(value, field)}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Copy to clipboard"
        >
          {copiedField === field ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Calculator className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Subnet Calculator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Calculate subnet masks, network addresses, and available host ranges
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle>Network Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="IP Address"
                    placeholder="192.168.1.1"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                  />

                  <Input
                    label="Subnet Mask"
                    placeholder="255.255.255.0"
                    value={subnetMask}
                    onChange={(e) => setSubnetMask(e.target.value)}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Common Masks
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {commonMasks.map((mask) => (
                        <button
                          key={mask.value}
                          onClick={() => setSubnetMask(mask.value)}
                          className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-500 dark:hover:border-primary-500 transition-colors text-gray-700 dark:text-gray-300"
                        >
                          {mask.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  <Button
                    fullWidth
                    onClick={handleCalculate}
                    isLoading={isLoading}
                    variant="primary"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {result ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Network Details</CardTitle>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleSave}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResultRow label="IP Address" value={result.ipAddress} field="ip" />
                    <ResultRow label="Subnet Mask" value={result.subnetMask} field="mask" />
                    <ResultRow label="CIDR Notation" value={`/${result.cidr}`} field="cidr" />
                    <ResultRow label="Wildcard Mask" value={result.wildcardMask} field="wildcard" />
                    <ResultRow label="Network Class" value={result.networkClass} field="class" />
                    <ResultRow label="IP Type" value={result.ipType} field="type" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Network Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResultRow label="Network Address" value={result.networkAddress} field="network" />
                    <ResultRow label="Broadcast Address" value={result.broadcastAddress} field="broadcast" />
                    <ResultRow label="First Host" value={result.firstHost} field="firstHost" />
                    <ResultRow label="Last Host" value={result.lastHost} field="lastHost" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Host Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResultRow
                      label="Total Hosts"
                      value={result.totalHosts.toLocaleString()}
                      field="totalHosts"
                    />
                    <ResultRow
                      label="Usable Hosts"
                      value={result.usableHosts.toLocaleString()}
                      field="usableHosts"
                    />
                    <ResultRow
                      label="Binary Subnet Mask"
                      value={result.binarySubnetMask}
                      field="binary"
                    />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No Calculation Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter an IP address and subnet mask to get started
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};