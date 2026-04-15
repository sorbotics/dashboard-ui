export interface CameraConfig {
  [key: string]: Camera;
}

export interface Camera {
  birdseye:         PurpleBirdseye;
  cameras:          Detail;
  database:         Database;
  detect:           Detect;
  detectors:        Detectors;
  environment_vars: EnvironmentVars;
  ffmpeg:           Ffmpeg;
  go2rtc:           EnvironmentVars;
  live:             Live;
  logger:           Logger;
  model:            Model;
  motion:           null;
  mqtt:             Mqtt;
  objects:          Objects;
  record:           Record;
  rtmp:             Rtmp;
  snapshots:        Snapshots;
  telemetry:        Telemetry;
  timestamp_style:  TimestampStyle;
  ui:               FluffyUI;
}

export interface PurpleBirdseye {
  enabled:  boolean;
  height:   number;
  mode:     string;
  quality:  number;
  restream: boolean;
  width:    number;
}

export interface Detail {
  [key: string]: Cam;
}

export interface Cam {
  best_image_timeout: number;
  birdseye:           FluffyBirdseye;
  detect:             Detect;
  enabled:            boolean;
  ffmpeg:             Ffmpeg;
  ffmpeg_cmds:        FfmpegCmd[];
  live:               Live;
  motion:             Motion;
  mqtt:               Snapshots;
  name:               string;
  label:              string;
  objects:            Objects;
  record:             Record;
  rtmp:               Rtmp;
  snapshots:          Snapshots;
  timestamp_style:    TimestampStyle;
  ui:                 PurpleUI;
  zones:              Zones;
}

export interface FluffyBirdseye {
  enabled: boolean;
  mode:    string;
}

export interface Detect {
  enabled:         boolean;
  fps:             number;
  height:          number;
  max_disappeared: number | null;
  stationary:      Stationary;
  width:           number;
}

export interface Stationary {
  interval:   number;
  max_frames: MaxFrames;
  threshold:  number | null;
}

export interface MaxFrames {
  default: null;
  objects: EnvironmentVars;
}

export interface EnvironmentVars {
}

export interface Ffmpeg {
  global_args:  string[];
  hwaccel_args: any[];
  input_args:   string;
  inputs?:      Input[];
  output_args:  OutputArgs;
}

export interface Input {
  global_args:  any[];
  hwaccel_args: any[];
  input_args:   any[];
  path:         string;
  roles:        string[];
}

export interface OutputArgs {
  detect: string[];
  record: string;
  rtmp:   string;
}

export interface FfmpegCmd {
  cmd:   string;
  roles: string[];
}

export interface Live {
  height:      number;
  quality:     number;
  stream_name: string;
}

export interface Motion {
  contour_area:     number;
  delta_alpha:      number;
  frame_alpha:      number;
  frame_height:     number;
  improve_contrast: boolean;
  mask:             string;
  mqtt_off_delay:   number;
  threshold:        number;
}

export interface Snapshots {
  bounding_box:   boolean;
  crop:           boolean;
  enabled:        boolean;
  height:         number | null;
  quality:        number;
  required_zones: any[];
  timestamp:      boolean;
  clean_copy?:    boolean;
  retain?:        SnapshotsRetain;
}

export interface SnapshotsRetain {
  default: number;
  mode:    string;
  objects: EnvironmentVars;
}

export interface Objects {
  filters: { [key: string]: Filter } | null;
  mask:    string;
  track:   string[];
}

export interface Filter {
  mask:      null;
  max_area:  number;
  max_ratio: number;
  min_area:  number;
  min_ratio: number;
  min_score: number;
  threshold: number;
}

export interface Record {
  enabled:           boolean;
  enabled_in_config: boolean | null;
  events:            Events;
  expire_interval:   number;
  retain:            RecordRetain;
  retain_days:       null;
}

export interface Events {
  objects:        null;
  post_capture:   number;
  pre_capture:    number;
  required_zones: any[];
  retain:         SnapshotsRetain;
}

export interface RecordRetain {
  days: number;
  mode: string;
}

export interface Rtmp {
  enabled: boolean;
}

export interface TimestampStyle {
  color:     Color;
  effect:    null;
  format:    string;
  position:  string;
  thickness: number;
}

export interface Color {
  blue:  number;
  green: number;
  red:   number;
}

export interface PurpleUI {
  dashboard: boolean;
  order:     number;
}

export interface Zones {
  zone_0: Zone0;
}

export interface Zone0 {
  coordinates: string;
  filters:     EnvironmentVars;
  objects:     any[];
}

export interface Database {
  path: string;
}

export interface Detectors {
  cpu: CPU;
}

export interface CPU {
  model:       Model;
  num_threads: number;
  type:        string;
}

export interface Model {
  height:             number;
  input_pixel_format: string;
  input_tensor:       string;
  labelmap:           EnvironmentVars;
  labelmap_path:      string;
  model_type:         string;
  path:               string;
  width:              number;
}

export interface Logger {
  default: string;
  logs:    EnvironmentVars;
}

export interface Mqtt {
  client_id:       string;
  enabled:         boolean;
  host:            string;
  password:        null;
  port:            number;
  stats_interval:  number;
  tls_ca_certs:    null;
  tls_client_cert: null;
  tls_client_key:  null;
  tls_insecure:    null;
  topic_prefix:    string;
  user:            null;
}

export interface Telemetry {
  version_check: boolean;
}

export interface FluffyUI {
  date_style:       string;
  live_mode:        string;
  strftime_fmt:     null;
  time_format:      string;
  time_style:       string;
  timezone:         string;
  use_experimental: boolean;
}
