import 'server-only';
import { TaskforceData } from './types';
import yaml from 'js-yaml';
import { promises as fs } from 'fs';
import path from 'path';

let cachedData: TaskforceData | null = null;

/**
 * Load and parse the taskforce YAML data
 * Caches the result for subsequent calls
 * This function is server-only
 */
export async function loadTaskforceData(): Promise<TaskforceData> {
  if (cachedData) {
    return cachedData;
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'taskforce.yaml');
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      throw new Error(`Taskforce data file not found at ${filePath}`);
    }

    const fileContents = await fs.readFile(filePath, 'utf8');
    
    if (!fileContents || fileContents.trim().length === 0) {
      throw new Error('Taskforce data file is empty');
    }

    const data = yaml.load(fileContents) as TaskforceData;
    
    // Validate data structure
    if (!data) {
      throw new Error('Failed to parse YAML: data is null or undefined');
    }

    if (!data.recommendations || !Array.isArray(data.recommendations)) {
      throw new Error('Invalid YAML structure: missing or invalid recommendations array');
    }

    if (!data.status_scales) {
      throw new Error('Invalid YAML structure: missing status_scales');
    }

    cachedData = data;
    return data;
  } catch (error) {
    // Clear cache on error to allow retry
    cachedData = null;
    
    if (error instanceof Error) {
      console.error('Failed to load taskforce data:', error.message);
      throw new Error(`Failed to load taskforce data: ${error.message}`);
    }
    
    throw new Error('Failed to load taskforce data: Unknown error');
  }
}

/**
 * Force reload the data (useful for development)
 */
export async function reloadTaskforceData(): Promise<TaskforceData> {
  cachedData = null;
  return loadTaskforceData();
}

/**
 * Get the data synchronously (only works after initial load)
 */
export function getTaskforceDataSync(): TaskforceData | null {
  return cachedData;
}
