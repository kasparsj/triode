## Trust signals

- CI runs build + smoke + package checks on Node 20 and 22.
- CI runs real Chromium and Firefox smoke tests of `examples/quickstart.html` on Node 20.
- CI runs non-global and multi-instance 3D browser smoke tests on Chromium and Firefox.
- CI validates all source examples for syntax integrity and runs generated examples + playground preset browser smoke coverage in Chromium.
- Release tags (`v*`) run version/changelog/tag metadata verification and attach tarball + checksum artifacts.
- GitHub Pages deploys generated docs and runnable examples from repository sources on every push to `main`.
