import type { ReactNode, FunctionComponent, SVGProps } from 'react';
import type { IconProps } from '@tabler/icons-react';
import {
  IconFile,
  IconFileTypeBmp,
  IconFileTypeCss,
  IconFileTypeCsv,
  IconFileTypeDoc,
  IconFileTypeDocx,
  IconFileTypeHtml,
  IconFileTypeJpg,
  IconFileTypeJs,
  IconFileTypeJsx,
  IconFileTypePdf,
  IconFileTypePhp,
  IconFileTypePng,
  IconFileTypePpt,
  IconFileTypeRs,
  IconFileTypeSql,
  IconFileTypeSvg,
  IconFileTypeTs,
  IconFileTypeTsx,
  IconFileTypeTxt,
  IconFileTypeVue,
  IconFileTypeXls,
  IconFileTypeXml,
  IconFileTypeZip,
} from '@tabler/icons-react';

import Cpp from '@/assets/icons/file/cpp.svg?react';
import C from '@/assets/icons/file/c.svg?react';
import Cs from '@/assets/icons/file/cs.svg?react';
import Ini from '@/assets/icons/file/ini.svg?react';
import Json from '@/assets/icons/file/json.svg?react';
import Md from '@/assets/icons/file/md.svg?react';
import Py from '@/assets/icons/file/py.svg?react';
import { BASE_ICON_PROPS } from '@/constants/icon';

export type ExtensionKey =
  | '.bmp'
  | '.cpp'
  | '.c'
  | '.cs'
  | '.css'
  | '.csv'
  | '.doc'
  | '.docx'
  | '.html'
  | '.ini'
  | '.jpg'
  | '.js'
  | '.json'
  | '.jsx'
  | '.md'
  | '.pdf'
  | '.php'
  | '.png'
  | '.ppt'
  | '.py'
  | '.rs'
  | '.sql'
  | '.svg'
  | '.ts'
  | '.tsx'
  | '.txt'
  | '.vue'
  | '.xls'
  | '.xml'
  | '.zip';

export interface BaseFileIconOpts {
  size?: number;
  stroke?: number;
  className?: string;
}

const tabler = (
  Icon: (p: IconProps) => ReactNode,
  opts: BaseFileIconOpts,
): ReactNode => (
  <Icon
    size={opts.size ?? BASE_ICON_PROPS.size}
    stroke={opts.stroke ?? BASE_ICON_PROPS.stroke}
    className={opts.className}
  />
);

const svgr = (
  Svg: FunctionComponent<SVGProps<SVGSVGElement>>,
  opts: BaseFileIconOpts,
): ReactNode => (
  <Svg
    width={Number(opts.size ?? BASE_ICON_PROPS.size)}
    height={Number(opts.size ?? BASE_ICON_PROPS.size)}
    className={opts.className}
  />
);

export const fileIconFactories: Record<
  string,
  (opts: BaseFileIconOpts) => ReactNode
> = {
  '.bmp': (o) => tabler(IconFileTypeBmp, o),
  '.cpp': (o) => svgr(Cpp, o),
  '.c': (o) => svgr(C, o),
  '.cs': (o) => svgr(Cs, o),
  '.css': (o) => tabler(IconFileTypeCss, o),
  '.csv': (o) => tabler(IconFileTypeCsv, o),
  '.doc': (o) => tabler(IconFileTypeDoc, o),
  '.docx': (o) => tabler(IconFileTypeDocx, o),
  '.html': (o) => tabler(IconFileTypeHtml, o),
  '.ini': (o) => svgr(Ini, o),
  '.jpg': (o) => tabler(IconFileTypeJpg, o),
  '.js': (o) => tabler(IconFileTypeJs, o),
  '.json': (o) => svgr(Json, o),
  '.jsx': (o) => tabler(IconFileTypeJsx, o),
  '.md': (o) => svgr(Md, o),
  '.pdf': (o) => tabler(IconFileTypePdf, o),
  '.php': (o) => tabler(IconFileTypePhp, o),
  '.png': (o) => tabler(IconFileTypePng, o),
  '.ppt': (o) => tabler(IconFileTypePpt, o),
  '.py': (o) => svgr(Py, o),
  '.rs': (o) => tabler(IconFileTypeRs, o),
  '.sql': (o) => tabler(IconFileTypeSql, o),
  '.svg': (o) => tabler(IconFileTypeSvg, o),
  '.ts': (o) => tabler(IconFileTypeTs, o),
  '.tsx': (o) => tabler(IconFileTypeTsx, o),
  '.txt': (o) => tabler(IconFileTypeTxt, o),
  '.vue': (o) => tabler(IconFileTypeVue, o),
  '.xls': (o) => tabler(IconFileTypeXls, o),
  '.xml': (o) => tabler(IconFileTypeXml, o),
  '.zip': (o) => tabler(IconFileTypeZip, o),
  default: (o) => tabler(IconFile, o),
};

export const supportedExtensions: ExtensionKey[] = [
  '.bmp',
  '.cpp',
  '.c',
  '.cs',
  '.css',
  '.csv',
  '.doc',
  '.docx',
  '.html',
  '.ini',
  '.jpg',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.pdf',
  '.php',
  '.png',
  '.ppt',
  '.py',
  '.rs',
  '.sql',
  '.svg',
  '.ts',
  '.tsx',
  '.txt',
  '.vue',
  '.xls',
  '.xml',
  '.zip',
];
