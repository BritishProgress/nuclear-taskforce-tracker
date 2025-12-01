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

  const filePath = path.join(process.cwd(), 'public', 'taskforce.yaml');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const data = yaml.load(fileContents) as TaskforceData;
  
  cachedData = data;
  return data;
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
