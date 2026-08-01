/**
 * M3U and M3U8 Playlist Parser Utility
 * Extracts channel attributes: id, name, logo, group/category, country, stream URL, etc.
 */

// ISO Country codes and flags mapping
export const COUNTRY_MAP = {
  US: { name: 'United States', flag: '🇺🇸', code: 'US' },
  UK: { name: 'United Kingdom', flag: '🇬🇧', code: 'UK' },
  GB: { name: 'United Kingdom', flag: '🇬🇧', code: 'UK' },
  CA: { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  FR: { name: 'France', flag: '🇫🇷', code: 'FR' },
  DE: { name: 'Germany', flag: '🇩🇪', code: 'DE' },
  IN: { name: 'India', flag: '🇮🇳', code: 'IN' },
  ES: { name: 'Spain', flag: '🇪🇸', code: 'ES' },
  IT: { name: 'Italy', flag: '🇮🇹', code: 'IT' },
  BR: { name: 'Brazil', flag: '🇧🇷', code: 'BR' },
  MX: { name: 'Mexico', flag: '🇲🇽', code: 'MX' },
  JP: { name: 'Japan', flag: '🇯🇵', code: 'JP' },
  KR: { name: 'South Korea', flag: '🇰🇷', code: 'KR' },
  AU: { name: 'Australia', flag: '🇦🇺', code: 'AU' },
  NL: { name: 'Netherlands', flag: '🇳🇱', code: 'NL' },
  TR: { name: 'Turkey', flag: '🇹🇷', code: 'TR' },
  RU: { name: 'Russia', flag: '🇷🇺', code: 'RU' },
  AR: { name: 'Argentina', flag: '🇦🇷', code: 'AR' },
  CN: { name: 'China', flag: '🇨🇳', code: 'CN' },
  INT: { name: 'International', flag: '🌍', code: 'INT' }
};

export function parseM3U(content) {
  if (!content || typeof content !== 'string') {
    return [];
  }

  const lines = content.split(/\r?\n/);
  const channels = [];
  let currentChannel = null;
  let defaultGroup = 'General';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    if (line.startsWith('#EXTGRP:')) {
      const groupMatch = line.replace('#EXTGRP:', '').trim();
      if (groupMatch) {
        defaultGroup = groupMatch;
        if (currentChannel) {
          currentChannel.group = groupMatch;
          detectCountry(currentChannel);
        }
      }
      continue;
    }

    if (line.startsWith('#EXTINF:')) {
      currentChannel = parseExtInfLine(line);
      if (!currentChannel.group) {
        currentChannel.group = defaultGroup;
      }
      detectCountry(currentChannel);
      continue;
    }

    // Skip comments/headers that start with #
    if (line.startsWith('#')) {
      continue;
    }

    // Stream URL line
    if (line.startsWith('http://') || line.startsWith('https://') || line.startsWith('rtmp://') || line.includes('.m3u8') || line.includes('.mp4')) {
      if (currentChannel) {
        currentChannel.url = line;
        channels.push({ ...currentChannel });
        currentChannel = null;
      } else {
        // Fallback for raw link without #EXTINF
        const urlParts = line.split('/');
        const fallbackName = urlParts[urlParts.length - 1] || `Channel ${channels.length + 1}`;
        const ch = {
          id: `ch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: fallbackName,
          logo: null,
          group: 'Uncategorized',
          url: line,
          tvgId: '',
          country: 'International',
          countryCode: 'INT',
          flag: '🌍'
        };
        channels.push(ch);
      }
    }
  }

  return channels;
}

function parseExtInfLine(line) {
  const channel = {
    id: `ch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: 'Unknown Channel',
    logo: null,
    group: '',
    tvgId: '',
    tvgCountry: '',
    duration: -1
  };

  const infParts = line.substring(8).split(',');
  const metaString = infParts[0] || '';
  
  if (infParts.length > 1) {
    channel.name = infParts.slice(1).join(',').trim();
  }

  const logoMatch = metaString.match(/tvg-logo=["']([^"']+)["']/i);
  if (logoMatch && logoMatch[1]) {
    channel.logo = logoMatch[1];
  }

  const groupMatch = metaString.match(/group-title=["']([^"']+)["']/i);
  if (groupMatch && groupMatch[1]) {
    channel.group = groupMatch[1];
  }

  const nameMatch = metaString.match(/tvg-name=["']([^"']+)["']/i);
  if (nameMatch && nameMatch[1] && (!channel.name || channel.name === 'Unknown Channel')) {
    channel.name = nameMatch[1];
  }

  const idMatch = metaString.match(/tvg-id=["']([^"']+)["']/i);
  if (idMatch && idMatch[1]) {
    channel.tvgId = idMatch[1];
  }

  const countryMatch = metaString.match(/tvg-country=["']([^"']+)["']/i);
  if (countryMatch && countryMatch[1]) {
    channel.tvgCountry = countryMatch[1].toUpperCase();
  }

  return channel;
}

function detectCountry(channel) {
  // If tvg-country is specified directly
  if (channel.tvgCountry && COUNTRY_MAP[channel.tvgCountry]) {
    const c = COUNTRY_MAP[channel.tvgCountry];
    channel.country = c.name;
    channel.countryCode = c.code;
    channel.flag = c.flag;
    return;
  }

  const textToScan = `${channel.name} ${channel.group}`.toUpperCase();

  // Country patterns
  const patterns = [
    { keys: ['USA', 'UNITED STATES', ' US ', '[US]', 'US:', 'US|'], code: 'US' },
    { keys: ['UK', 'UNITED KINGDOM', 'ENGLAND', 'BRITAIN', '[UK]', 'UK:', 'UK|', 'GB'], code: 'UK' },
    { keys: ['CANADA', ' CAN ', '[CA]', 'CA:', 'CA|'], code: 'CA' },
    { keys: ['FRANCE', ' FRENCH ', '[FR]', 'FR:', 'FR|'], code: 'FR' },
    { keys: ['GERMANY', 'DEUTSCHLAND', 'GERMAN', '[DE]', 'DE:', 'DE|'], code: 'DE' },
    { keys: ['INDIA', 'INDIAN', 'HINDI', '[IN]', 'IN:', 'IN|'], code: 'IN' },
    { keys: ['SPAIN', 'SPANISH', 'ESPAÑA', '[ES]', 'ES:', 'ES|'], code: 'ES' },
    { keys: ['ITALY', 'ITALIAN', 'ITALIA', '[IT]', 'IT:', 'IT|'], code: 'IT' },
    { keys: ['BRAZIL', 'BRASIL', 'PORTUGUESE', '[BR]', 'BR:', 'BR|'], code: 'BR' },
    { keys: ['MEXICO', 'MEXICAN', '[MX]', 'MX:', 'MX|'], code: 'MX' },
    { keys: ['JAPAN', 'JAPANESE', '[JP]', 'JP:', 'JP|'], code: 'JP' },
    { keys: ['KOREA', '[KR]', 'KR:', 'KR|'], code: 'KR' },
    { keys: ['AUSTRALIA', 'AUSSPIE', '[AU]', 'AU:', 'AU|'], code: 'AU' },
    { keys: ['NETHERLANDS', 'DUTCH', 'HOLLAND', '[NL]', 'NL:', 'NL|'], code: 'NL' },
    { keys: ['TURKEY', 'TURKISH', '[TR]', 'TR:', 'TR|'], code: 'TR' },
    { keys: ['RUSSIA', 'RUSSIAN', '[RU]', 'RU:', 'RU|'], code: 'RU' }
  ];

  for (const p of patterns) {
    if (p.keys.some(k => textToScan.includes(k))) {
      const c = COUNTRY_MAP[p.code];
      channel.country = c.name;
      channel.countryCode = c.code;
      channel.flag = c.flag;
      return;
    }
  }

  // Fallback
  channel.country = 'International';
  channel.countryCode = 'INT';
  channel.flag = '🌍';
}
