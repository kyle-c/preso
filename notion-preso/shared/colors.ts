export const C = {
  turquoise: '#2BF2F1',
  slate: '#082422',
  blueberry: '#6060BF',
  evergreen: '#35605F',
  cactus: '#60D06F',
  mango: '#F19D38',
  papaya: '#F26629',
  lime: '#DCFF00',
  lychee: '#FFCD9C',
  sky: '#8DFDFA',
  stone: '#EFEBE7',
  linen: '#FEFCF9',
  concrete: '#CFCABF',
  mocha: '#877867',
} as const

export const COMMENT_COLORS = [
  { bg: '#6060BF', tint: 'rgba(96,96,191,0.3)', name: 'blueberry' },
  { bg: '#60D06F', tint: 'rgba(96,208,111,0.3)', name: 'cactus' },
  { bg: '#F19D38', tint: 'rgba(241,157,56,0.3)', name: 'mango' },
  { bg: '#F26629', tint: 'rgba(242,102,41,0.3)', name: 'papaya' },
  { bg: '#2BF2F1', tint: 'rgba(43,242,241,0.3)', name: 'turquoise' },
] as const

export function pickCommentColor(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  return COMMENT_COLORS[Math.abs(hash) % COMMENT_COLORS.length]
}
