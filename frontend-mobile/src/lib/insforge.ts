import { Insforge } from '@insforge/sdk';

const INSFORGE_BASE_URL = 'https://3fi9ibjk.ap-southeast.insforge.app';
const INSFORGE_ANON_KEY = 'ik_b9ba82796e69299f48331cfb7a71df28'; // Public Anon Key Reference

export const insforge = new Insforge(INSFORGE_BASE_URL, INSFORGE_ANON_KEY);
